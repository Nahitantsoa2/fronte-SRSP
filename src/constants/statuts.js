export const STATUTS = {
  soumise: "Soumise",
  en_cours: "En cours",
  validee: "Validée",
  rejetee: "Rejetée",
  complement_demande: "Complément",
};

export const STATUTS_EN_COURS = ["soumise", "en_cours", "complement_demande"];

export const COULEURS_STATUT = {
  soumise: "bg-brand-50 text-brand-700 border-brand-200",
  en_cours: "bg-amber-50 text-amber-700 border-amber-200",
  validee: "bg-brand-100 text-brand-800 border-brand-200",
  rejetee: "bg-red-50 text-red-700 border-red-200",
  complement_demande: "bg-brand-50 text-brand-600 border-brand-100",
};

export const libelleStatut = (statut) => STATUTS[statut] || statut;
