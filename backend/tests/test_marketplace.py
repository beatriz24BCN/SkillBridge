from conftest import auth


def test_company_and_job_ownership(client, register_user, create_company_and_job):
    _, owner_token, company, job = create_company_and_job()
    _, outsider_token, _ = register_user("Outsider")

    assert client.get(f"/api/companies/{company['id']}").status_code == 200
    assert client.get(f"/api/jobs/{job['id']}").status_code == 200
    assert client.patch(
        f"/api/companies/{company['id']}",
        headers=auth(outsider_token),
        json={"name": "Stolen"},
    ).status_code == 403
    assert client.patch(
        f"/api/jobs/{job['id']}",
        headers=auth(outsider_token),
        json={"title": "Stolen"},
    ).status_code == 403
    assert client.delete(
        f"/api/jobs/{job['id']}",
        headers=auth(outsider_token),
    ).status_code == 403

    updated = client.patch(
        f"/api/jobs/{job['id']}",
        headers=auth(owner_token),
        json={"title": "Senior Backend Engineer"},
    )
    assert updated.status_code == 200
    assert updated.get_json()["title"] == "Senior Backend Engineer"


def test_applications_duplicate_prevention_and_company_management(
    client, register_user, create_company_and_job,
):
    _, employer_token, _, job = create_company_and_job()
    candidate, candidate_token, _ = register_user("Candidate")
    _, outsider_token, _ = register_user("Outsider")

    application = client.post(
        "/api/applications/",
        headers=auth(candidate_token),
        json={"job_id": job["id"], "cover_letter": "Hello", "status": "accepted"},
    )
    assert application.status_code == 201
    application = application.get_json()
    assert application["status"] == "pending"

    duplicate = client.post(
        "/api/applications/",
        headers=auth(candidate_token),
        json={"job_id": job["id"]},
    )
    assert duplicate.status_code == 409
    assert client.get("/api/applications/", headers=auth(candidate_token)).get_json()[0]["job"]["id"] == job["id"]
    assert client.patch(
        f"/api/applications/{application['id']}",
        headers=auth(candidate_token),
        json={"status": "accepted"},
    ).status_code == 403
    assert client.get(
        f"/api/applications/job/{job['id']}",
        headers=auth(outsider_token),
    ).status_code == 403

    owner_view = client.get(
        f"/api/applications/job/{job['id']}",
        headers=auth(employer_token),
    )
    assert owner_view.status_code == 200
    assert owner_view.get_json()[0]["user"]["id"] == candidate["id"]

    status = client.patch(
        f"/api/applications/{application['id']}",
        headers=auth(employer_token),
        json={"status": "accepted"},
    )
    assert status.status_code == 200
    assert status.get_json()["status"] == "accepted"


def test_saved_jobs_are_private_idempotent_and_removable(
    client, register_user, create_company_and_job,
):
    _, _, company, job = create_company_and_job()
    _, token, _ = register_user("Candidate")
    _, other_token, _ = register_user("Other")

    assert client.get("/api/saved-jobs/").status_code == 401
    first = client.post(f"/api/saved-jobs/{job['id']}", headers=auth(token))
    second = client.post(f"/api/saved-jobs/{job['id']}", headers=auth(token))
    assert first.status_code == 201
    assert second.status_code == 200
    assert second.get_json()["id"] == first.get_json()["id"]

    own = client.get("/api/saved-jobs/", headers=auth(token))
    other = client.get("/api/saved-jobs/", headers=auth(other_token))
    assert len(own.get_json()) == 1
    assert own.get_json()[0]["job"]["company"]["id"] == company["id"]
    assert other.get_json() == []
    assert client.delete(
        f"/api/saved-jobs/{job['id']}",
        headers=auth(other_token),
    ).status_code == 404

    assert client.delete(
        f"/api/saved-jobs/{job['id']}",
        headers=auth(token),
    ).status_code == 200
    assert client.get("/api/saved-jobs/", headers=auth(token)).get_json() == []
