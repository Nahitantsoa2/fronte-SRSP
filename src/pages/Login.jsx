import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { REDIRECTIONS_ROLE } from "../constants/roles";
import AuthShell from "../components/AuthShell";
import {
  Mail,
  Lock,
  IdCard,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matricule, setMatricule] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, chargement, erreur } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const utilisateur = await login(email, password, matricule);
      navigate(REDIRECTIONS_ROLE[utilisateur.role] || "/");
    } catch {
      // L'erreur est exposée par le contexte d'authentification.
    }
  }

  return (
    <AuthShell
      variant="login"
      headline="Vos démarches administratives, plus simples et plus humaines."
      description="Retrouvez vos dossiers, échangez avec votre service et laissez l'assistant IA vous accompagner, dans un espace sécurisé pensé pour les agents publics."
    >
      <div className="auth-card__header">
        <span className="auth-card__eyebrow">Espace agent</span>
        <h1 className="auth-card__title">Connexion</h1>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="email">Adresse email</label>
          <div className="auth-input">
            <Mail />
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@srsp.mg"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="password">Mot de passe</label>
          <div className="auth-input auth-input--toggle">
            <Lock />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="auth-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="matricule">
            IM (matricule) <span>— facultatif</span>
          </label>
          <div className="auth-input">
            <IdCard />
            <input
              id="matricule"
              name="matricule"
              type="text"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              placeholder="Ex : 482296"
              autoComplete="off"
            />
          </div>
        </div>

        {erreur && (
          <div className="auth-error" role="alert">
            <AlertCircle />
            <span>{erreur}</span>
          </div>
        )}

        <button type="submit" className="auth-submit" disabled={chargement}>
          {chargement ? (
            <>
              <span className="auth-spinner" />
              Connexion...
            </>
          ) : (
            <>
              Se connecter
              <ArrowRight size={18} strokeWidth={2} />
            </>
          )}
        </button>
      </form>

      <p className="auth-switch">
        Pas encore de compte ? <Link to="/register">Créer un compte</Link>
      </p>
    </AuthShell>
  );
}
