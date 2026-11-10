export const ROLES = {
  fonctionnaire: "Fonctionnaire",
  chef_service: "Chef de service",
  administrateur: "Admin",
};

export const COULEURS_ROLE = {
  administrateur: "bg-amber-50 text-amber-700 border border-amber-200",
  chef_service: "bg-brand-100 text-brand-800 border border-brand-200",
  fonctionnaire: "bg-brand-50 text-brand-700 border border-brand-200",
};

export const REDIRECTIONS_ROLE = {
  fonctionnaire: "/fonctionnaire",
  chef_service: "/chef",
  administrateur: "/admin",
};

export const libelleRole = (role) => ROLES[role] || role;
