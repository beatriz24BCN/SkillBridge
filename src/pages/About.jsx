import React from 'react'
import { Link } from 'react-router-dom'
import './About.css'

export default function About(){
  return (
    <main className="about-page">
      <div className="about-page about-shell">
        <section className="about-hero" aria-labelledby="about-hero-title">
          <div className="about-hero-copy">
            <p className="about-kicker">Connecting talent and companies through AI</p>
            <h1 id="about-hero-title" className="about-heading-xl">Donde el talento encuentra su puente hacia el futuro.</h1>
            <p className="about-body-lg">SkillBridge une inteligencia artificial y criterio humano para transformar cómo las empresas descubren talento y cómo los profesionales construyen carreras. Rápido, transparente y con sentido.</p>
            <div className="about-hero-actions">
              <Link className="about-button about-button-primary" to="/jobs">Explorar oportunidades</Link>
              <Link className="about-button about-button-secondary" to="/employers">Para empresas</Link>
            </div>
          </div>

          <div className="about-hero-product" aria-hidden>
            <div className="about-product-window">
              <div className="about-product-bar">
                <span className="about-product-dot"/>
                <span className="about-product-dot"/>
                <span className="about-product-dot"/>
                <div className="about-product-url">skillbridge.ai/matching/live</div>
              </div>
              <div className="about-product-main">
                <article className="about-product-candidate">
                  <p className="about-product-label">Candidate signal</p>
                  <h3 className="about-product-title">Senior Frontend Engineer</h3>
                  <p className="about-product-sub">TypeScript • React • Design Systems</p>
                  <div className="about-product-tags">
                    <span className="about-product-tag">Portfolio verified</span>
                    <span className="about-product-tag">Ready this week</span>
                  </div>
                </article>

                <article className="about-product-score">
                  <p className="about-product-label">Live match</p>
                  <div className="about-product-score-value">96%</div>
                  <p className="about-product-sub">Confidence index</p>
                </article>

                <article className="about-product-events">
                  <p className="about-product-label">Decision feed</p>
                  <div className="about-product-event"><span className="about-product-bullet"/>Skills aligned with role profile</div>
                  <div className="about-product-event"><span className="about-product-bullet"/>Salary range within budget</div>
                  <div className="about-product-event"><span className="about-product-bullet"/>Interview slot suggested by AI</div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="about-story" aria-labelledby="about-story-title">
          <div className="about-story-head">
            <h2 id="about-story-title" className="about-heading-lg">Por qué nació SkillBridge</h2>
            <p className="about-body-md">Vimos procesos largos, opacos y sesgados donde el talento y la oportunidad se perdían en la fricción. Nació la idea de un puente: tecnología que potencia decisiones humanas, no que las reemplace.</p>
          </div>

          <div className="about-story-flow" aria-hidden>
            <article className="about-story-node about-story-node-problem">
              <p className="about-story-node-title">Problema</p>
              <p className="about-story-node-body">Procesos lentos, opacos y con demasiada fricción.</p>
            </article>
            <article className="about-story-node about-story-node-ai">
              <p className="about-story-node-title">IA explicable</p>
              <p className="about-story-node-body">Señales reales, priorización inteligente y contexto.</p>
            </article>
            <article className="about-story-node about-story-node-result">
              <p className="about-story-node-title">Resultado</p>
              <p className="about-story-node-body">Matches más rápidos, justos y medibles.</p>
            </article>
            <div className="about-story-connector about-story-connector-a"/>
            <div className="about-story-connector about-story-connector-b"/>
            <div className="about-story-pulse"/>
          </div>
        </section>

        <section className="about-mission" aria-labelledby="about-mission-title">
          <div className="about-mission-copy">
            <h2 id="about-mission-title" className="about-heading-lg">Nuestra misión</h2>
            <p className="about-body-md">Construir puentes entre talento y oportunidades con IA que informa y empodera. Creamos experiencias de búsqueda y selección que priorizan calidad, confianza y resultados humanos.</p>
          </div>

          <div className="about-mission-metric" aria-hidden>
            <div className="about-mission-main">96%</div>
            <p className="about-mission-main-label">Precisión media del motor de matching</p>
            <div className="about-mission-support">
              <div className="about-mission-support-item">
                <span className="about-mission-support-value">3K+</span>
                <span className="about-mission-support-label">Empresas activas</span>
              </div>
              <div className="about-mission-support-item">
                <span className="about-mission-support-value">120K+</span>
                <span className="about-mission-support-label">Profesionales</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-values" aria-labelledby="about-values-title">
          <h2 id="about-values-title" className="about-heading-lg">Nuestros valores</h2>
          <div className="about-values-grid">
            <article className="about-values-card about-values-card-innovation">
              <p className="about-values-emoji">🤖</p>
              <h3 className="about-values-title">Innovación</h3>
              <p className="about-values-body">Experimentamos con IA responsable para crear mejores descubrimientos de talento.</p>
            </article>
            <article className="about-values-card about-values-card-trust">
              <p className="about-values-emoji">🔒</p>
              <h3 className="about-values-title">Confianza</h3>
              <p className="about-values-body">Privacidad, verificación y transparencia en cada paso.</p>
            </article>
            <article className="about-values-card about-values-card-talent">
              <p className="about-values-emoji">🌱</p>
              <h3 className="about-values-title">Talento</h3>
              <p className="about-values-body">Ponemos a las personas en el centro de cada decisión.</p>
            </article>
            <article className="about-values-card about-values-card-tech">
              <p className="about-values-emoji">⚙️</p>
              <h3 className="about-values-title">Tecnología</h3>
              <p className="about-values-body">Creamos sistemas robustos que escalan sin perder humanidad.</p>
            </article>
          </div>
        </section>

        <section className="about-journey" aria-labelledby="about-journey-title">
          <h2 id="about-journey-title" className="about-heading-lg">Cómo funciona</h2>
          <ol className="about-journey-path">
            <li className="about-journey-step about-journey-step-1">
              <span className="about-journey-index">01</span>
              <h3 className="about-journey-title">Perfil</h3>
              <p className="about-journey-body">Completa tu experiencia y credenciales.</p>
            </li>
            <li className="about-journey-step about-journey-step-2">
              <span className="about-journey-index">02</span>
              <h3 className="about-journey-title">Analizamos</h3>
              <p className="about-journey-body">IA contextual que prioriza señales relevantes.</p>
            </li>
            <li className="about-journey-step about-journey-step-3">
              <span className="about-journey-index">03</span>
              <h3 className="about-journey-title">Matches</h3>
              <p className="about-journey-body">Oportunidades curadas con explicaciones claras.</p>
            </li>
            <li className="about-journey-step about-journey-step-4">
              <span className="about-journey-index">04</span>
              <h3 className="about-journey-title">Contratación</h3>
              <p className="about-journey-body">Cierres más rápidos y coherentes.</p>
            </li>
          </ol>
        </section>

        <section className="about-dashboard" aria-labelledby="about-dashboard-title">
          <div className="about-dashboard-copy">
            <h2 id="about-dashboard-title" className="about-heading-lg">Por qué SkillBridge</h2>
            <p className="about-body-md">Nuestra plataforma parece y se siente como una herramienta real: decisiones medibles, paneles que informan y controles que devuelven confianza al proceso de contratación.</p>
          </div>

          <div className="about-dashboard-screen" aria-hidden>
            <div className="about-dashboard-nav">
              <span className="about-dashboard-pill">Pipeline</span>
              <span className="about-dashboard-pill">Matching</span>
              <span className="about-dashboard-pill">Signals</span>
            </div>
            <div className="about-dashboard-kpi-row">
              <article className="about-dashboard-kpi about-dashboard-kpi-main">
                <p className="about-dashboard-kpi-label">Match accuracy</p>
                <p className="about-dashboard-kpi-value">96%</p>
              </article>
              <article className="about-dashboard-kpi">
                <p className="about-dashboard-kpi-label">Time to shortlist</p>
                <p className="about-dashboard-kpi-value">-41%</p>
              </article>
            </div>
            <div className="about-dashboard-table">
              <div className="about-dashboard-row">
                <span className="about-dashboard-role">Frontend Developer</span>
                <span className="about-dashboard-score">95</span>
                <span className="about-dashboard-state">Ready</span>
              </div>
              <div className="about-dashboard-row">
                <span className="about-dashboard-role">Product Designer</span>
                <span className="about-dashboard-score">92</span>
                <span className="about-dashboard-state">Review</span>
              </div>
              <div className="about-dashboard-row">
                <span className="about-dashboard-role">Data Engineer</span>
                <span className="about-dashboard-score">89</span>
                <span className="about-dashboard-state">Interview</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-impact" aria-labelledby="about-impact-title">
          <h2 id="about-impact-title" className="about-heading-lg">Nuestro impacto</h2>
          <div className="about-impact-grid">
            <article className="about-impact-item about-impact-item-xl">
              <p className="about-impact-value">120K+</p>
              <p className="about-impact-label">Profesionales</p>
            </article>
            <article className="about-impact-item about-impact-item-md-a">
              <p className="about-impact-value">25K+</p>
              <p className="about-impact-label">Puestos</p>
            </article>
            <article className="about-impact-item about-impact-item-md-b">
              <p className="about-impact-value">3K+</p>
              <p className="about-impact-label">Empresas</p>
            </article>
            <article className="about-impact-item about-impact-item-sm">
              <p className="about-impact-value">95%</p>
              <p className="about-impact-label">Satisfacción</p>
            </article>
          </div>
        </section>

        <section className="about-cta">
          <div className="about-cta-inner">
            <h2 className="about-heading-lg about-cta-title">Únete al puente.</h2>
            <p className="about-body-md about-cta-text">Impulsa tu carrera o encuentra talento del futuro con tecnología en la que confías.</p>
            <div className="about-cta-actions">
              <Link className="about-button about-button-light" to="/signup">Empieza ahora</Link>
              <Link className="about-button about-button-outline" to="/contact">Habla con nosotros</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

