import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import {
  User,
  Mail,
  IdCard,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    matricule: "",
    password: "",
    password_confirmation: "",
  });
  const [voirMdp, setVoirMdp] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur(null);

    if (form.password.length < 8) {
      setErreur("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setErreur("Le mot de passe doit contenir au moins une lettre et un chiffre.");
      return;
    }
    if (form.password !== form.password_confirmation) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    setEnvoi(true);
    try {
      await register(form);
      navigate("/fonctionnaire", { replace: true });
    } catch (err) {
      const messages = err?.response?.data?.errors;
      const apiMessage = err?.response?.data?.message;
      const networkErreur = !err.response
        ? "Impossible de contacter le serveur backend. Vérifiez que l'API est démarrée."
        : null;

      setErreur(
        networkErreur ||
          (messages ? Object.values(messages).flat().join(" ") : null) ||
          apiMessage ||
          "Une erreur est survenue lors de l'inscription."
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <AuthShell
      variant="register"
      headline="Rejoignez un espace pensé pour les agents publics."
      description="Créez votre compte pour suivre vos démarches, déposer vos demandes et dialoguer avec les services compétents depuis un même espace."
    >
      <div className="auth-card__header">
        <span className="auth-card__eyebrow">Nouveau compte</span>
        <h1 className="auth-card__title">Créer un compte</h1>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-grid">
          <div className="auth-field">
            <label htmlFor="nom">Nom</label>
            <div className="auth-input">
              <User />
              <input
                id="nom"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Rakoto"
                required
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="prenom">Prénom</label>
            <div className="auth-input">
              <User />
              <input
                id="prenom"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                placeholder="Jean"
                required
                autoComplete="given-name"
              />
            </div>
          </div>
        </div>

        <div className="auth-grid">
          <div className="auth-field">
            <label htmlFor="email">Adresse email</label>
            <div className="auth-input">
              <Mail />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                required
                autoComplete="email"
              />
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
                value={form.matricule}
                onChange={handleChange}
                placeholder="Ex : 482296"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <div className="auth-grid">
          <div className="auth-field">
            <label htmlFor="password">Mot de passe</label>
            <div className="auth-input auth-input--toggle">
              <Lock />
              <input
                id="password"
                name="password"
                type={voirMdp ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="8 caractères minimum"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-toggle"
                onClick={() => setVoirMdp((value) => !value)}
                aria-label={
                  voirMdp
                    ? "Masquer les mots de passe"
                    : "Afficher les mots de passe"
                }
                aria-pressed={voirMdp}
              >
                {voirMdp ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password_confirmation">Confirmation</label>
            <div className="auth-input">
              <Lock />
              <input
                id="password_confirmation"
                name="password_confirmation"
                type={voirMdp ? "text" : "password"}
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Retapez le mot de passe"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        {erreur && (
          <div className="auth-error" role="alert">
            <AlertCircle />
            <span>{erreur}</span>
          </div>
        )}

        <button type="submit" className="auth-submit" disabled={envoi}>
          {envoi ? (
            <>
              <span className="auth-spinner" />
              Création du compte...
            </>
          ) : (
            <>
              Créer mon compte
              <ArrowRight size={18} strokeWidth={2} />
            </>
          )}
        </button>
      </form>

      <p className="auth-switch">
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </AuthShell>
  );
}
