import {
  Landmark,
  FileText,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  MessageSquare,
  Users,
} from "lucide-react";

function Brand({ compact = false }) {
  const iconSize = compact ? 20 : 24;

  return (
    <div className={`auth-brand ${compact ? "auth-brand--compact" : ""}`}>
      <div className="auth-brand__mark">
        <Landmark size={iconSize} strokeWidth={2} />
      </div>
      <div className="auth-brand__name">
        SRSP <span>Assistant IA</span>
      </div>
    </div>
  );
}

function LoginIllustration() {
  return (
    <svg
      className="auth-art auth-art--login"
      viewBox="0 0 560 180"
      role="img"
      aria-label="Illustration : connexion sécurisée, suivi de dossier et assistance IA"
    >
      <defs>
        <linearGradient id="authLoginGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eaf2ed" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#eaf2ed" stopOpacity="0" />
        </linearGradient>
      </defs>

      <circle cx="280" cy="92" r="150" fill="url(#authLoginGlow)" />

      <path
        className="auth-art__soft"
        d="M78 104 C 122 66, 158 62, 190 84"
        fill="none"
        strokeDasharray="3 7"
      />
      <path
        className="auth-art__soft"
        d="M252 118 C 322 154, 400 152, 472 116"
        fill="none"
        strokeDasharray="3 7"
      />

      {/* Utilisateur connecté */}
      <g className="auth-art__float">
        <circle className="auth-art__fill auth-art__stroke" cx="52" cy="108" r="22" />
        <circle className="auth-art__stroke" cx="52" cy="102" r="7" fill="none" />
        <path className="auth-art__stroke" d="M40 122 Q 52 112 64 122" fill="none" />
        <circle
          className="auth-art__soft"
          cx="52"
          cy="108"
          r="30"
          fill="none"
          strokeDasharray="2 6"
        />
      </g>

      {/* Connexion sécurisée */}
      <g className="auth-art__float auth-art__float--delay">
        <path
          className="auth-art__fill auth-art__stroke"
          d="M215 44 L248 58 V92 C248 116 233 130 215 139 C197 130 182 116 182 92 V58 Z"
        />
        <path
          className="auth-art__accent-stroke"
          d="M201 92 L211 103 L231 81"
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Dossier suivi */}
      <g>
        <path
          className="auth-art__fill auth-art__stroke"
          d="M282 96 h20 l7 -9 h34 a6 6 0 0 1 6 6 v40 a6 6 0 0 1 -6 6 h-61 a6 6 0 0 1 -6 -6 v-31 a6 6 0 0 1 6 -6 z"
        />
        <path className="auth-art__soft" d="M292 112 h44 M292 122 h34 M292 132 h40" fill="none" />
        <circle className="auth-art__accent-fill" cx="344" cy="139" r="10" />
        <path
          className="auth-art__deep"
          d="M339 139 l4 4 l7 -8"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Assistance IA */}
      <g className="auth-art__float">
        <rect
          className="auth-art__fill auth-art__stroke"
          x="372"
          y="46"
          width="66"
          height="40"
          rx="13"
        />
        <path className="auth-art__fill auth-art__stroke" d="M394 86 l-7 11 l16 -9" />
        <circle className="auth-art__accent-fill" cx="390" cy="66" r="2.6" />
        <circle className="auth-art__accent-fill" cx="404" cy="66" r="2.6" />
        <circle className="auth-art__accent-fill" cx="418" cy="66" r="2.6" />
        <path
          className="auth-art__accent-fill auth-art__spark"
          d="M452 32 l2.5 6 l6 2.5 l-6 2.5 l-2.5 6 l-2.5 -6 l-6 -2.5 l6 -2.5 z"
        />
        <path
          className="auth-art__accent-fill auth-art__spark"
          d="M360 34 l1.8 4.2 l4.2 1.8 l-4.2 1.8 l-1.8 4.2 l-1.8 -4.2 l-4.2 -1.8 l4.2 -1.8 z"
        />
      </g>

      {/* Service administratif */}
      <g>
        <path className="auth-art__stroke" d="M478 92 L504 70 L530 92" fill="none" />
        <rect
          className="auth-art__fill auth-art__stroke"
          x="484"
          y="92"
          width="40"
          height="44"
          rx="4"
        />
        <path className="auth-art__soft" d="M494 100 v28 M504 100 v28 M514 100 v28" fill="none" />
        <rect
          className="auth-art__fill auth-art__stroke"
          x="500"
          y="116"
          width="9"
          height="20"
          rx="1.5"
        />
      </g>

      <circle className="auth-art__accent-fill" cx="146" cy="40" r="2" opacity=".8" />
      <circle className="auth-art__accent-fill" cx="330" cy="158" r="2" opacity=".7" />
      <circle className="auth-art__accent-fill" cx="458" cy="146" r="2" opacity=".7" />
      <path className="auth-art__soft" d="M126 148 h24 M143 140 l8 8 l-8 8" fill="none" />
    </svg>
  );
}

function Preview() {
  return (
    <div className="auth-preview" aria-hidden="true">
      <div className="auth-preview__head">
        <div className="auth-preview__doc">
          <FileText />
        </div>
        <div className="auth-preview__identity">
          <p className="auth-preview__label">Dossier n° 2026-4521</p>
          <p className="auth-preview__meta">Autorisation de voyage</p>
        </div>
        <span className="auth-preview__status">
          <Clock />
          En cours
        </span>
      </div>

      <div className="auth-preview__progress">
        <span style={{ width: "62%" }} />
      </div>

      <div className="auth-preview__rows">
        <div>
          <CheckCircle2 />
          Demande reçue et enregistrée
        </div>
        <div>
          <ShieldCheck />
          Vérification par le service compétent
        </div>
      </div>

      <div className="auth-preview__assistant">
        <div className="auth-preview__assistant-icon">
          <Sparkles />
        </div>
        <p>
          <strong>Assistant SRSP</strong>
          Votre dossier avance normalement. Une réponse est attendue sous 48 h.
        </p>
      </div>
    </div>
  );
}

export default function AuthShell({
  variant = "login",
  headline,
  description,
  children,
  footer,
}) {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-panel__glow auth-panel__glow--one" />
        <div className="auth-panel__glow auth-panel__glow--two" />
        <div className="auth-panel__grid" />

        <div className="auth-panel__inner">
          <Brand />

          <div className="auth-panel__content">
            <span className="auth-panel__kicker">
              <Landmark />
              Service régional de la solde et des personnels
            </span>

            <h1 className="auth-panel__title">{headline}</h1>
            <p className="auth-panel__text">{description}</p>

            <div className="auth-illustration">
              <LoginIllustration />
            </div>

            <Preview />

            <ul className="auth-points">
              <li>
                <span className="auth-points__icon">
                  <Clock />
                </span>
                <div>
                  <strong>Suivi en temps réel</strong>
                  <p>Chaque étape de votre dossier est visible.</p>
                </div>
              </li>
              <li>
                <span className="auth-points__icon">
                  <MessageSquare />
                </span>
                <div>
                  <strong>Assistant IA</strong>
                  <p>Des réponses claires, disponibles à tout moment.</p>
                </div>
              </li>
              <li>
                <span className="auth-points__icon">
                  <Users />
                </span>
                <div>
                  <strong>Service humain</strong>
                  <p>Un échange direct avec votre service.</p>
                </div>
              </li>
            </ul>
          </div>

          <p className="auth-panel__footer">
            © {new Date().getFullYear()} SRSP Assistant IA · Ambohibary · Ambositra
          </p>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-side__top">
          <Brand compact />
        </div>

        <div className="auth-form-side__center">
          <div className={`auth-card auth-card--${variant}`}>{children}</div>
          {footer}
        </div>

        <div className="auth-form-side__bottom">
          <span>© {new Date().getFullYear()} SRSP Assistant IA</span>
          <span className="auth-dot" />
          <span>Ambohibary · Ambositra</span>
        </div>
      </section>
    </main>
  );
}
