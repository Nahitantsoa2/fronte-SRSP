import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FileText, MessageSquare, ClipboardList, Info } from "lucide-react";
import AppHeader from "../../components/AppHeader";
import SuiviContenu from "./SuiviContenu";
import "../../styles/dashboard.css";

export default function DashboardFonctionnaire() {
  const { utilisateur } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Navbar */}
      <AppHeader
        icon={<FileText size={22} />}
        iconClass="from-brand-600 to-brand-500 shadow-brand-500/20"
        title={`Bonjour, ${utilisateur?.prenom ?? ""}`}
        titleClass="text-lg sm:text-xl"
        subtitle={
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
            Fonctionnaire
          </span>
        }
        extra={
          <>
            <button
              onClick={() => navigate("/fonctionnaire/nouvelle-demande")}
              className="flex items-center gap-2 bg-brand-50 text-brand-700 hover:bg-brand-100 px-2.5 sm:px-4 py-2 rounded-xl transition-all font-semibold text-sm border border-brand-200"
            >
              <ClipboardList size={18} />
              <span className="hidden sm:inline">Nouvelle demande</span>
            </button>
            <button
              onClick={() => navigate("/fonctionnaire/informations")}
              className="flex items-center gap-2 bg-brand-50 text-brand-700 hover:bg-brand-100 px-2.5 sm:px-4 py-2 rounded-xl transition-all font-semibold text-sm border border-brand-200"
            >
              <Info size={18} />
              <span className="hidden sm:inline">Informations</span>
            </button>
            <button
              onClick={() => navigate("/fonctionnaire/reclamations")}
              className="flex items-center gap-2 bg-white text-surface-600 hover:bg-surface-50 px-2.5 sm:px-4 py-2 rounded-xl transition-all font-semibold text-sm border border-surface-200"
            >
              <MessageSquare size={18} />
              <span className="hidden sm:inline">Messages</span>
            </button>
            <button
              onClick={() => navigate("/fonctionnaire/chat-ia")}
              className="flex items-center gap-2 bg-brand-50 text-brand-700 hover:bg-brand-100 px-2.5 sm:px-4 py-2 rounded-xl transition-all font-semibold text-sm border border-brand-200"
            >
              <MessageSquare size={18} />
              <span className="hidden sm:inline">Discuter avec l'IA</span>
            </button>
          </>
        }
      />

      {/* Main Content : interface de suivi des dossiers */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SuiviContenu />
      </main>
    </div>
  );
}
