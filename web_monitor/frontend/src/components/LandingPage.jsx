import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ActivitySquare, ArrowRight, ShieldCheck, Users, MessageSquare, 
  Award, FileText, CheckCircle2, ChevronRight, Mail, Phone, MapPin 
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmailInput('');
    }
  };

  return (
    <div className="landing-page">
      {/* 1. HERO BANNER */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <span className="preview-badge">Portail Officiel & Télémesure</span>
            <h1>Livre Blanc sur l'Avenir des Cliniques et de la Télésurveillance</h1>
            <p>
              Offrez des solutions de suivi télémétrique en temps réel, de monitoring des constantes vitales et de gestion des alertes médicales pour vos patients.
            </p>
            <div className="hero-actions">
              <button onClick={() => navigate('/login')} className="btn-pill btn-pill-white">
                Accéder au portail <ArrowRight size={18} />
              </button>
              <a href="#about" className="btn-pill btn-pill-white-outline">
                En savoir plus
              </a>
            </div>
          </div>

          <div className="hero-preview-card">
            <span className="preview-badge">Plateforme Intelligente C.A.R.E.</span>
            <h3 className="preview-title">Tableau de Bord & Monitoring</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Surveillance continue de l'ECG, du rythme cardiaque (HR), du niveau de stress (GSR) et dispatching d'urgence instantané.
            </p>
            <div className="preview-stats-grid">
              <div>
                <div className="preview-stat-number">600+</div>
                <div className="preview-stat-label">Cliniques & Membres</div>
              </div>
              <div>
                <div className="preview-stat-number">99.9%</div>
                <div className="preview-stat-label">Disponibilité API</div>
              </div>
              <div>
                <div className="preview-stat-number">&lt; 50ms</div>
                <div className="preview-stat-label">Latence Télémesure</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-grid">
            <div className="about-text">
              <div className="section-tag">À PROPOS DE C.A.R.E.</div>
              <h2 className="section-heading">Une vision moderne de la santé connectée</h2>
              <p>
                La plateforme C.A.R.E. accompagne les praticiens, hôpitaux et cliniques spécialisées dans la numérisation et la sécurisation des flux de données médicales en temps réel.
              </p>
              <p>
                Grâce à notre infrastructure certifiée, bénéficiez d'une interconnexion fluide entre les objets connectés (wearables, moniteurs ECG), le personnel soignant et les tableaux de bord décisionnels.
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <button onClick={() => navigate('/login')} className="btn-pill btn-pill-navy">
                  Rejoindre le réseau
                </button>
              </div>
            </div>

            <div className="about-card">
              <div className="preview-badge">DOCUMENTATION & RECHERCHE</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                Livre Blanc sur la Télémesure Clinique
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Un guide complet compilant les normes de sécurité, la configuration des seuils physiologiques et le dispatching des alertes d'urgence en milieu hospitalier.
              </p>
              <button onClick={() => navigate('/login')} className="btn-pill btn-pill-outline" style={{ fontSize: '0.85rem' }}>
                Télécharger le document PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FULL-WIDTH DEEP NAVY BANNER */}
      <section className="navy-banner">
        <div className="navy-banner-content">
          <h2>Rejoignez un réseau de plus de 600 professionnels de santé</h2>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', marginBottom: '1.75rem' }}>
            Participez aux consultations, accédez aux outils de suivi télémétrique et bénéficiez d'un accompagnement personnalisé.
          </p>
          <button onClick={() => navigate('/login')} className="btn-pill btn-pill-white">
            Devenir membre ou partenaire
          </button>
        </div>
      </section>

      {/* 4. 3-COLUMN FEATURE CARDS GRID */}
      <section className="features-section">
        <div className="section-container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <div className="section-tag">POURQUOI REJOINDRE C.A.R.E. ?</div>
            <h2 className="section-heading">Des outils conçus pour vos besoins cliniques</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-circle">
                <MessageSquare size={28} />
              </div>
              <h3>Échangez avec vos confrères</h3>
              <p>
                Communiquez en direct avec vos collègues praticiens et experts en télémesure pour un suivi interdisciplinaire optimal.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle">
                <CheckCircle2 size={28} />
              </div>
              <h3>Participez aux consultations</h3>
              <p>
                Donnez votre avis sur l'évolution des protocoles cliniques et la configuration des seuils de vigilance médicale.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle">
                <Award size={28} />
              </div>
              <h3>Bénéfices & Avantages</h3>
              <p>
                Profitez d'une gamme complète d'outils de monitoring, de tableaux de bord personnalisés et de rapports automatisés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVICES & MEMBER BENEFITS GRID (2-COLUMN) */}
      <section className="benefits-section">
        <div className="section-container">
          <div className="section-tag">BÉNÉFICES AUX MEMBRES</div>
          <h2 className="section-heading">Profitez de services exclusifs et adaptés</h2>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-badge">Alfred</div>
              <div className="benefit-body">
                <h3>Capteurs Médicaux & Télémesure</h3>
                <p>
                  Module d'acquisition de données physiologiques (ECG, Fréquence Cardiaque, Réponse Galvanique de la Peau).
                </p>
                <button onClick={() => navigate('/login')} className="btn-pill btn-pill-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1.1rem' }}>
                  En savoir plus
                </button>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-badge">Cyber</div>
              <div className="benefit-body">
                <h3>Sécurité & Confidentialité</h3>
                <p>
                  Chiffrement de bout en bout conforme aux normes HDS, HIPAA et RGPD pour les données de santé.
                </p>
                <button onClick={() => navigate('/login')} className="btn-pill btn-pill-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1.1rem' }}>
                  En savoir plus
                </button>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-badge">Logic</div>
              <div className="benefit-body">
                <h3>Logiciel de Gestion Téléphonique & Alerte</h3>
                <p>
                  Interface de suivi des alertes panique et configuration des seuils d'intervention prioritaires.
                </p>
                <button onClick={() => navigate('/login')} className="btn-pill btn-pill-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1.1rem' }}>
                  En savoir plus
                </button>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-badge">UI/UX</div>
              <div className="benefit-body">
                <h3>Branding & Design Ergonomique</h3>
                <p>
                  Interfaces modernes adaptées au confort des soignants et à la lisibilité en situation de crise.
                </p>
                <button onClick={() => navigate('/login')} className="btn-pill btn-pill-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1.1rem' }}>
                  En savoir plus
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LATEST NEWS / UPDATES SECTION ("Derniers Communiqués") */}
      <section className="news-section">
        <div className="section-container">
          <div className="section-tag">ACTUALITÉS & MÉDIA</div>
          <h2 className="section-heading" style={{ color: 'var(--primary)' }}>Derniers Communiqués</h2>

          <div className="news-grid">
            <div className="news-card">
              <div>
                <div className="news-date">
                  <FileText size={14} /> 02 Septembre 2026
                </div>
                <h3>L'avenir de la télémesure clinique au Québec</h3>
                <p>
                  Publication officielle du rapport d'analyse des besoins technologiques pour les cliniques médicales.
                </p>
              </div>
              <a href="#about" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Lire la suite <ChevronRight size={16} />
              </a>
            </div>

            <div className="news-card">
              <div>
                <div className="news-date">
                  <FileText size={14} /> 28 Août 2026
                </div>
                <h3>Mise à jour v2.4 de la plateforme C.A.R.E.</h3>
                <p>
                  Intégration du décodage en temps réel des signaux ECG et amélioration du dispatching d'alerte.
                </p>
              </div>
              <a href="#about" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Lire la suite <ChevronRight size={16} />
              </a>
            </div>

            <div className="news-card">
              <div>
                <div className="news-date">
                  <FileText size={14} /> 15 Août 2026
                </div>
                <h3>Appel à la mobilisation pour la santé préventive</h3>
                <p>
                  Rejoignez les ateliers de concertation pour façonner les fonctionnalités de la prochaine version.
                </p>
              </div>
              <a href="#about" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Lire la suite <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER SECTION */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)', fontWeight: 800, fontSize: '1.25rem' }}>
              <ActivitySquare size={26} color="var(--primary)" />
              <span>C.A.R.E. Network</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '320px' }}>
              Réseau de télémesure médicale et plateforme intelligente de suivi des constantes vitales en temps réel.
            </p>
          </div>

          <div className="footer-col">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><a href="#about">À propos</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#features">Fonctionnalités</a></li>
              <li><a href="#news">Communiqués</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Portail</h4>
            <ul className="footer-links">
              <li><a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Espace Doctorat</a></li>
              <li><a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Suivi Patient</a></li>
              <li><a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Administration</a></li>
              <li><a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Connexion API</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Abonnez-vous à l'infolettre</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Recevez les dernières actualités médicales et mises à jour du système.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Votre adresse courriel" 
                className="newsletter-input"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <button type="submit" className="btn-pill btn-pill-navy" style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}>
                {subscribed ? 'Inscrit avec succès !' : "S'abonner"}
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 C.A.R.E. Healthcare Monitoring Network. Tous droits réservés.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Politique de confidentialité</a>
            <a href="#terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Conditions d'utilisation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
