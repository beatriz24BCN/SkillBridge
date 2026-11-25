import multiprocessing
import os
import time

import pytest
from limits import RateLimitItemPerMinute
from limits.storage import storage_from_string
from limits.strategies import FixedWindowRateLimiter


REDIS_URL = os.getenv("TEST_REDIS_URL")


def _hit_shared_limit(redis_url, result):
    storage = storage_from_string(redis_url, wrap_exceptions=False)
    limiter = FixedWindowRateLimiter(storage)
    result.put(limiter.hit(RateLimitItemPerMinute(2), "multi-process-check"))


@pytest.mark.skipif(not REDIS_URL, reason="TEST_REDIS_URL is required for Redis integration")
def test_redis_storage_is_shared_across_processes_and_expires():
    storage = storage_from_string(REDIS_URL, wrap_exceptions=False)
    storage.reset()
    limiter = FixedWindowRateLimiter(storage)
    item = RateLimitItemPerMinute(2)
    key = item.key_for("multi-process-check")

    results = multiprocessing.Queue()
    processes = [
        multiprocessing.Process(target=_hit_shared_limit, args=(REDIS_URL, results))
        for _ in range(3)
    ]
    for process in processes:
        process.start()
    for process in processes:
        process.join(timeout=10)
        assert process.exitcode == 0

    outcomes = sorted(results.get(timeout=2) for _ in processes)
    assert outcomes == [False, True, True]
    expiry = storage.get_expiry(key)
    assert expiry > time.time()
    assert expiry <= time.time() + 61

    storage.reset()
