import React from 'react'
import { Link } from 'react-router-dom'
import './About.css'

export default function About(){
  return (
    <main className="about-page">
      <div className="about-viewport container">

        {/* SECTION 1 — HERO: gran titular + composición de producto a la derecha */}
        <section className="hero-section">
          <div className="hero-left">
            <div className="hero-eyebrow">Connecting talent and companies through AI</div>
            <h1 className="hero-title">Donde el talento encuentra su puente hacia el futuro.</h1>
            <p className="hero-lead">SkillBridge une inteligencia artificial y criterio humano para transformar cómo las empresas descubren talento y cómo los profesionales construyen carreras. Rápido, transparente y con sentido.</p>

            <div className="hero-actions">
              <Link className="btn-primary" to="/jobs">Explorar oportunidades</Link>
              <Link className="btn-ghost" to="/employers">Para empresas</Link>
            </div>
          </div>

          <div className="hero-right" aria-hidden>
            <figure className="hero-composition" role="presentation">
              <svg className="dash-mock" viewBox="0 0 600 380" preserveAspectRatio="xMidYMid slice" aria-hidden>
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="var(--primary)" stopOpacity="0.95" />
                    <stop offset="1" stopColor="var(--primary-hover)" stopOpacity="0.85" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="600" height="380" rx="18" fill="#fff" />
                <g transform="translate(28,24)">
                  <rect width="520" height="48" rx="8" fill="url(#g1)" opacity="0.12" />
                  <g transform="translate(0,72)">
                    <rect width="360" height="160" rx="12" fill="#fff" stroke="rgba(13,42,148,0.04)" />
                    <g transform="translate(14,16)">
                      <rect width="120" height="18" rx="6" fill="rgba(13,42,148,0.06)" />
                      <rect y="34" width="180" height="12" rx="6" fill="rgba(13,42,148,0.04)" />
                      <rect y="60" width="100" height="12" rx="6" fill="rgba(13,42,148,0.03)" />
                    </g>
                    <g transform="translate(384,16)">
                      <rect width="100" height="60" rx="10" fill="url(#g1)" />
                      <text x="50" y="36" textAnchor="middle" fill="#fff" fontWeight="800" fontSize="20">96%</text>
                    </g>
                  </g>
                  <g transform="translate(392,260)">
                    <rect width="120" height="80" rx="10" fill="#fff" stroke="rgba(13,42,148,0.04)" />
                    <g transform="translate(12,12)">
                      <rect width="96" height="10" rx="6" fill="rgba(13,42,148,0.06)" />
                      <rect y="20" width="64" height="8" rx="6" fill="rgba(13,42,148,0.04)" />
                    </g>
                  </g>
                </g>
              </svg>
              <figcaption className="sr-only">Mock de dashboard que muestra match score y métricas principales</figcaption>
            </figure>
          </div>
        </section>

        {/* SECTION 2 — OUR STORY: bloque visual narrativo */}
        <section className="story-section">
          <div className="story-grid">
            <div className="story-visual" aria-hidden>
              <svg className="story-illustration" viewBox="0 0 360 260" preserveAspectRatio="xMidYMid">
                <defs>
                  <linearGradient id="sgrad" x1="0" x2="1">
                    <stop offset="0" stopColor="rgba(37,99,235,0.95)" />
                    <stop offset="1" stopColor="rgba(29,78,216,0.9)" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="360" height="260" rx="18" fill="#fff" />
                <g transform="translate(18,18)">
                  <path d="M12 160 C120 20, 240 20, 328 160" stroke="url(#sgrad)" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.22" />
                  <circle cx="40" cy="168" r="18" fill="url(#sgrad)" opacity="0.95" />
                  <circle cx="320" cy="168" r="18" fill="#fff" stroke="rgba(13,42,148,0.06)" />

                  
                  <g transform="translate(24,116)">
                    <rect width="88" height="56" rx="10" fill="#fff" stroke="rgba(13,42,148,0.04)" />
                    <text x="12" y="30" fontSize="12" fill="rgba(13,42,148,0.8)" fontWeight="700">Candidate</text>
                  </g>

                  
                  <g transform="translate(232,116)">
                    <rect width="88" height="56" rx="10" fill="url(#sgrad)" />
                    <text x="44" y="34" fontSize="12" fill="#fff" fontWeight="900" textAnchor="middle">Company</text>
                  </g>

                  
                  <g transform="translate(148,66)">
                    <rect x="-26" y="-26" width="52" height="52" rx="10" fill="#0b2a66" opacity="0.06" />
                    <rect x="-20" y="-20" width="40" height="40" rx="8" fill="url(#sgrad)" />
                    <circle cx="0" cy="0" r="6" fill="#fff" />
                    <path d="M-14 10 L14 -14" stroke="#fff" strokeWidth="1.6" opacity="0.9" strokeLinecap="round" />
                  </g>

                  <g transform="translate(200,30)">
                    <rect width="86" height="36" rx="8" fill="url(#sgrad)" />
                    <text x="10" y="22" fontSize="12" fill="#fff" fontWeight="800">Match</text>
                    <text x="66" y="22" fontSize="16" fill="#fff" fontWeight="900" textAnchor="end">96%</text>
                  </g>
                </g>
              </svg>
            </div>

            <div className="story-copy">
              <h2 className="section-title">Por qué nació SkillBridge</h2>
              <div className="story-block">
                <p className="lead">Vimos procesos largos, opacos y sesgados donde el talento y la oportunidad se perdían en la fricción. Nació la idea de un puente: tecnología que potencia decisiones humanas, no que las reemplace.</p>
                <div className="story-flow">
                  <article className="flow-step">
                    <div className="flow-icon">⚠️</div>
                    <div className="flow-content">
                      <div className="flow-title">Problema</div>
                      <div className="flow-text">Contratación lenta, opaca y con fricciones que pierden talento.</div>
                    </div>
                  </article>

                  <div className="flow-connector">→</div>

                  <article className="flow-step">
                    <div className="flow-icon">🤖</div>
                    <div className="flow-content">
                      <div className="flow-title">Solución</div>
                      <div className="flow-text">IA que prioriza señales de talento y ofrece explicaciones claras.</div>
                    </div>
                  </article>

                  <div className="flow-connector">→</div>

                  <article className="flow-step">
                    <div className="flow-icon">🚀</div>
                    <div className="flow-content">
                      <div className="flow-title">Resultado</div>
                      <div className="flow-text">Matches más rápidos, justos y medibles.</div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — MISSION: composición con métrica principal */}
        <section className="mission-section">
          <div className="mission-inner">
            <div className="mission-dashboard-card">
              <div className="dash-top">
                <div className="dash-left">
                  <div className="dash-value">96% <span className="dash-sub">Match</span></div>
                  <div className="dash-note">Precisión media del motor de matching</div>
                </div>
                <div className="dash-right">
                  <div className="dash-chip">AI Live</div>
                </div>
              </div>

              <div className="dash-bottom">
                <div className="dash-cell">
                  <div className="cell-num">3K+</div>
                  <div className="cell-label">Empresas</div>
                </div>
                <div className="dash-cell">
                  <div className="cell-num">120K+</div>
                  <div className="cell-label">Profesionales</div>
                </div>
              </div>
            </div>

            <div className="mission-copy">
              <h2 className="section-title">Nuestra misión</h2>
              <p className="lead">Construir puentes entre talento y oportunidades con IA que informa y empodera. Creamos experiencias de búsqueda y selección que priorizan calidad, confianza y resultados humanos.</p>
            </div>
          </div>
        </section>

        {/* SECTION 4 — VALUES: mosaico asimétrico */}
        <section className="values-section">
          <h2 className="section-title">Nuestros valores</h2>
          <div className="values-mosaic">
            <div className="mosaic-col-left">
              <div className="mosaic-large">
                <div className="icon">🤖</div>
                <h3>Innovación</h3>
                <p>Experimentamos con IA responsable para crear mejores descubrimientos de talento.</p>
              </div>
              <div className="mosaic-small tall">
                <div className="icon">🌱</div>
                <h4>Talento</h4>
              </div>
            </div>

            <div className="mosaic-col-right">
              <div className="mosaic-horizontal">
                <div className="icon">🔒</div>
                <div>
                  <h3>Confianza</h3>
                  <p>Privacidad, verificación y transparencia en cada paso.</p>
                </div>
              </div>
              <div className="mosaic-small short">
                <div className="icon">⚙️</div>
                <h4>Tecnología</h4>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — HOW IT WORKS: timeline narrativo */}
        <section className="how-section">
          <h2 className="section-title">Cómo funciona</h2>
          <svg className="timeline-path" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="gline" x1="0" x2="1">
                <stop offset="0" stopColor="rgba(37,99,235,0.9)" />
                <stop offset="1" stopColor="rgba(29,78,216,0.85)" />
              </linearGradient>
            </defs>
            <path d="M60 60 C300 20, 600 100, 1140 60" stroke="url(#gline)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.12" />
          </svg>

          <ol className="narrative-timeline">
            <li>
              <div className="step-number">1</div>
              <div className="step-copy">
                <h4>Perfil</h4>
                <p>Completa tu experiencia y credenciales.</p>
              </div>
            </li>
            <li>
              <div className="step-number">2</div>
              <div className="step-copy">
                <h4>Analizamos</h4>
                <p>IA contextual que prioriza señales relevantes.</p>
              </div>
            </li>
            <li>
              <div className="step-number">3</div>
              <div className="step-copy">
                <h4>Matches</h4>
                <p>Oportunidades curadas con explicaciones claras.</p>
              </div>
            </li>
            <li>
              <div className="step-number">4</div>
              <div className="step-copy">
                <h4>Contratación</h4>
                <p>Cierres más rápidos y coherentes.</p>
              </div>
            </li>
          </ol>
        </section>

        {/* SECTION 6 — WHY SKILLBRIDGE: dashboard protagonista con checks */}
        <section className="why-section">
          <h2 className="section-title">Por qué SkillBridge</h2>
          <div className="why-layout">
            <div className="why-dashboard" aria-hidden>
              <div className="board-integrated">
                <div className="board-metric">
                  <div className="big-val">96%</div>
                  <div className="big-label">Match Accuracy</div>
                </div>
                <div className="board-stats">
                  <div className="stat-row">
                    <div className="bar" style={{width: '72%'}}/>
                  </div>
                  <ul className="checks-list">
                    <li>Verified Skills</li>
                    <li>AI Matching</li>
                    <li>Smart Ranking</li>
                    <li>Identity</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="why-copy">
              <p className="lead">Nuestra plataforma parece y se siente como una herramienta real: decisiones medibles, paneles que informan y controles que devuelven confianza al proceso de contratación.</p>
            </div>
          </div>
        </section>

        {/* SECTION 7 — IMPACT: composición rítmica de métricas */}
        <section className="impact-section">
          <h2 className="section-title">Nuestro impacto</h2>
          <div className="impact-composition">
            <div className="impact-main">
              <div className="impact-num">120K+</div>
              <div className="impact-label">Profesionales</div>
            </div>

            <div className="impact-side">
              <div className="impact-item">25K+<div className="label">Puestos</div></div>
              <div className="impact-item">3K+<div className="label">Empresas</div></div>
              <div className="impact-item small">95%<div className="label">Satisfacción</div></div>
            </div>
          </div>
        </section>

        {/* SECTION 8 — CTA FINAL */}
        <section className="final-cta">
          <div className="cta-inner">
            <h2>Únete al puente.</h2>
            <p className="lead">Impulsa tu carrera o encuentra talento del futuro con tecnología en la que confías.</p>
            <div className="cta-actions">
              <Link className="btn-primary" to="/signup">Empieza ahora</Link>
              <Link className="btn-ghost" to="/contact">Habla con nosotros</Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}

