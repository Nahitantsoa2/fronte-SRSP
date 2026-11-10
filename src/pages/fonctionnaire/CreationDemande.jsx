import { useEffect, useState } from "react";
import api from "../../services/api";
import { CheckCircle } from "lucide-react";

export default function CreationDemande({ onCreee }) {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    id_type_demarche: "",
    nom: "",
    matricule: "",
    motif: "",
  });
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [succes, setSucces] = useState(false);

  useEffect(() => {
    api
      .get("/types-demarche")
      .then(({ data }) => setTypes(data))
      .catch(() => setTypes([]));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur(null);
    setSucces(false);
    setEnvoi(true);

    try {
      const { data } = await api.post("/demandes", {
        id_type_demarche: form.id_type_demarche,
        details: {
          ...(form.nom && { nom: form.nom }),
          ...(form.matricule && { matricule: form.matricule }),
          ...(form.motif && { motif: form.motif }),
        },
      });
      setSucces(true);
      setForm({ id_type_demarche: "", nom: "", matricule: "", motif: "" });
      onCreee?.(data);
    } catch (err) {
      setErreur(
        err.response?.data?.message || "Impossible de créer la demande."
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-item flex-col items-stretch gap-3">
      <div className="card-title">Créer une demande — formulaire manuel</div>

      <select name="id_type_demarche" value={form.id_type_demarche} onChange={handleChange} required>
        <option value="">-- Choisir le type de démarche --</option>
        {types.map((t) => (
          <option key={t.id_type_demarche} value={t.id_type_demarche}>
            {t.libelle}
          </option>
        ))}
      </select>

      <input
        name="nom" placeholder="Nom complet (optionnel)"
        value={form.nom} onChange={handleChange}
      />
      <input
        name="matricule" placeholder="Matricule (optionnel)"
        value={form.matricule} onChange={handleChange}
      />
      <textarea
        name="motif" placeholder="Motif / précisions (optionnel)" rows={2}
        value={form.motif} onChange={handleChange}
      />

      {erreur && <p className="text-sm text-red-600">{erreur}</p>}
      {succes && <p className="text-sm text-brand-700 flex items-center gap-2"><CheckCircle size={16} /> Demande créée.</p>}

      <button className="btn btn-valider self-start" type="submit" disabled={envoi}>
        {envoi ? "Envoi..." : "Soumettre la demande"}
      </button>
    </form>
  );
}
