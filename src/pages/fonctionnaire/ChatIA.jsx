import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import MarkdownMessage from "../../components/MarkdownMessage";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  MessageSquarePlus,
  Sparkles,
  Trash2,
  Menu,
  Copy,
  Check,
  Plus,
  ShieldCheck,
} from "lucide-react";
import "../../styles/chat.css";

function formaterDate(valeur) {
  if (!valeur) return "";
  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatIA() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOuvert, setSidebarOuvert] = useState(false);
  const [copieId, setCopieId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function chargerMessages(id) {
    try {
      const { data } = await api.get(`/conversations/${id}/messages`);
      setMessages(data);
    } catch (error) {
      console.error("Erreur lors du chargement des messages", error);
    }
  }

  async function chargerConversations() {
    try {
      const { data } = await api.get("/conversations");
      setConversations(data);
      if (data.length > 0) {
        setActiveConversationId((prev) => prev ?? data[0].id_conversation);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des conversations", error);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- setState survient après await (asynchrone), pas de rendu en cascade
    chargerConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- setState survient après await (asynchrone)
      chargerMessages(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const zone = inputRef.current;
    if (!zone) return;
    zone.style.height = "auto";
    zone.style.height = `${Math.min(zone.scrollHeight, 160)}px`;
  }, [newMessage]);

  const creerNouvelleConversation = async () => {
    try {
      const { data } = await api.post("/conversations");
      setConversations((prev) => [data, ...prev]);
      setActiveConversationId(data.id_conversation);
      setMessages([]);
      setSidebarOuvert(false);
      inputRef.current?.focus();
    } catch (error) {
      console.error("Erreur lors de la création de la conversation", error);
    }
  };

  const supprimerConversation = async (id, e) => {
    e.stopPropagation();

    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette conversation ?"
    );
    if (!confirmation) return;

    try {
      await api.delete(`/conversations/${id}`);

      const nouvellesConversations = conversations.filter(
        (conv) => conv.id_conversation !== id
      );
      setConversations(nouvellesConversations);

      if (activeConversationId === id) {
        if (nouvellesConversations.length > 0) {
          setActiveConversationId(nouvellesConversations[0].id_conversation);
        } else {
          setActiveConversationId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la conversation", error);
      alert("Impossible de supprimer la conversation. Veuillez réessayer.");
    }
  };

  const copierMessage = async (texte, id) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(texte);
      } else {
        const zone = document.createElement("textarea");
        zone.value = texte;
        zone.style.position = "fixed";
        zone.style.opacity = "0";
        document.body.appendChild(zone);
        zone.select();
        document.execCommand("copy");
        document.body.removeChild(zone);
      }
      setCopieId(id);
      window.setTimeout(() => {
        setCopieId((current) => (current === id ? null : current));
      }, 2000);
    } catch (error) {
      console.error("Copie impossible", error);
    }
  };

  const envoyerMessage = async () => {
    if (!newMessage.trim() || !activeConversationId || loading) return;

    const messageText = newMessage.trim();
    setNewMessage("");

    const optimisticUserMessage = {
      id_message: `local-${Date.now()}`,
      contenu: messageText,
      expediteur: "utilisateur",
      date_envoi: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMessage]);
    setLoading(true);

    try {
      const { data } = await api.post(
        `/conversations/${activeConversationId}/messages`,
        { contenu: messageText }
      );
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
      const errorMessage = {
        id_message: `erreur-${Date.now()}`,
        contenu:
          "Désolé, impossible de joindre le serveur. Veuillez vérifier votre connexion ou réessayer plus tard.",
        expediteur: "agent_ia",
        date_envoi: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const suggestions = [
    {
      categorie: "Solde",
      questions: [
        "Comment récupérer mon bon de caisse ?",
        "Pièces pour le mandatement de solde ?",
        "Je veux faire une réclamation concernant ma solde.",
      ],
    },
    {
      categorie: "Pension",
      questions: [
        "Pièces pour la réversion orphelin ?",
        "Pièces pour un changement d'assignation ?",
        "Pièces pour la rectification nom, prénom, CIN ?",
        "Pièces pour la révision ordre nationale ?",
        "Pièces pour le remandatement ?",
        "Pièces pour la révision d'indice ?",
        "Pièces pour la révision MPE ?",
        "Pièces pour la révision de pourcentage ?",
        "Pièces pour la révision de bonification ?",
      ],
    },
    {
      categorie: "Visa — Agent contractuel",
      questions: [
        "Pièces pour un renouvellement de contrat (Agent EFA) ?",
        "Pièces à fournir pour un avenant ?",
        "Pièces pour l'intégration ?",
        "Pièces pour la majoration de salaire (Agent ELD) ?",
      ],
    },
    {
      categorie: "Visa — Agent fonctionnaire",
      questions: [
        "Pièces pour un avancement de classe ?",
        "Pièces pour un avancement d'échelon ?",
        "Pièces pour un reclassement indiciaire ?",
        "Pièces pour une majoration d'indice (catégorie VIII) ?",
        "Pièces pour la bonification RSM ?",
        "Pièces pour la bonification DELF-DALF ?",
        "Pièces pour l'indemnité d'installation de retraite ?",
        "Pièces pour la titularisation ?",
        "Pièces pour l'indemnité compensatrice de congé non pris ?",
      ],
    },
    {
      categorie: "Visa — Cas particulier",
      questions: ["Que faut-il fournir en cas de décès d'un agent ?"],
    },
  ];

  return (
    <div className="h-screen bg-surface-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-surface-200 shadow-sm z-40 flex-shrink-0">
        <div className="max-w-full mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/fonctionnaire")}
              className="p-2 rounded-xl text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-all"
              aria-label="Retour au tableau de bord"
              title="Retour"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => setSidebarOuvert(true)}
              className="md:hidden p-2 rounded-xl text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-all"
              title="Liste des conversations"
              aria-label="Ouvrir l'historique"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-700 to-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20 flex-shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-surface-900 truncate">
                  Assistant IA
                </h1>
                <p className="text-xs text-surface-500 truncate">
                  Aide pour vos démarches
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={creerNouvelleConversation}
            className="flex items-center gap-2 bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
            title="Nouvelle conversation"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">Nouvelle conversation</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Conversations */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-surface-200 flex flex-col flex-shrink-0 transition-transform duration-300 shadow-2xl md:shadow-none ${
            sidebarOuvert ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="p-3 border-b border-surface-100">
            <button
              onClick={creerNouvelleConversation}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-700 to-brand-500 hover:from-brand-800 hover:to-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
            >
              <MessageSquarePlus size={18} />
              Nouvelle discussion
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-surface-400">
                <MessageSquarePlus size={32} className="mb-2 opacity-40" />
                <p className="text-sm text-center">
                  Aucune conversation pour le moment.
                </p>
                <p className="text-xs text-center mt-1">
                  Lancez une discussion pour commencer.
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const active = activeConversationId === conv.id_conversation;
                return (
                  <div
                    key={conv.id_conversation}
                    onClick={() => {
                      setActiveConversationId(conv.id_conversation);
                      setSidebarOuvert(false);
                    }}
                    className={`group w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      active
                        ? "bg-brand-50 text-brand-700 font-semibold border border-brand-200"
                        : "text-surface-600 hover:bg-surface-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          active ? "bg-brand-500" : "bg-surface-300"
                        }`}
                      />
                      <div className="min-w-0">
                        <span className="block truncate">
                          Conversation du{" "}
                          {new Date(
                            conv.date_debut || conv.created_at
                          ).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        <span className="block text-[11px] font-normal text-surface-400">
                          {active ? "Discussion en cours" : "Historique"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) =>
                        supprimerConversation(conv.id_conversation, e)
                      }
                      title="Supprimer cette conversation"
                      aria-label="Supprimer cette conversation"
                      className={`flex-shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-red-50 hover:text-red-600 ${
                        active ? "text-brand-400" : "text-surface-400"
                      }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 border-t border-surface-100">
            <p className="flex items-start gap-2 text-[11px] leading-relaxed text-surface-400">
              <ShieldCheck size={14} className="mt-0.5 flex-shrink-0" />
              Les réponses s'appuient sur la base documentaire SRSP. Vérifiez
              toujours auprès du service compétent.
            </p>
          </div>
        </aside>

        {/* Backdrop mobile */}
        {sidebarOuvert && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOuvert(false)}
          />
        )}

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-surface-50 min-w-0">
          {activeConversationId ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
                <div className="max-w-3xl mx-auto space-y-5">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 flex items-center justify-center mb-5 shadow-lg shadow-brand-500/25 animate-float">
                        <Bot size={36} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-surface-800 mb-2">
                        Comment puis-je vous aider ?
                      </h3>
                      <p className="text-surface-500 mb-8 max-w-md">
                        Posez-moi vos questions sur les démarches
                        administratives et je vous guiderai pas à pas.
                      </p>

                      <div className="w-full space-y-4">
                        {suggestions.map((groupe) => (
                          <div key={groupe.categorie} className="text-left">
                            <p className="text-xs font-bold uppercase tracking-wide text-brand-500 mb-2">
                              {groupe.categorie}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {groupe.questions.map((suggestion) => (
                                <button
                                  key={suggestion}
                                  onClick={() => {
                                    setNewMessage(suggestion);
                                    inputRef.current?.focus();
                                  }}
                                  className="text-left px-3 py-2 bg-white rounded-lg border border-surface-200 text-xs text-surface-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all shadow-sm hover:shadow-md"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isUser = msg.expediteur === "utilisateur";
                      const id = msg.id_message ?? `msg-${index}`;
                      const heure = formaterDate(
                        msg.date_envoi || msg.created_at
                      );
                      const copie = copieId === id;

                      return (
                        <div key={id} className="msg-group fade-in">
                          <div
                            className={`flex gap-3 ${
                              isUser ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                                isUser
                                  ? "bg-gradient-to-br from-brand-700 to-brand-500 text-white"
                                  : "bg-white border border-surface-200 text-brand-600"
                              }`}
                            >
                              {isUser ? (
                                <User size={16} />
                              ) : (
                                <Bot size={16} />
                              )}
                            </div>

                            <div
                              className={`flex flex-col min-w-0 ${
                                isUser ? "items-end" : "items-start"
                              }`}
                            >
                              <div
                                className={`px-4 py-3 rounded-2xl max-w-full shadow-sm ${
                                  isUser
                                    ? "bg-gradient-to-br from-brand-700 to-brand-500 text-white rounded-br-md"
                                    : "msg-ia bg-white border border-surface-100 text-surface-800 rounded-bl-md"
                                }`}
                              >
                                {isUser ? (
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap m-0">
                                    {msg.contenu}
                                  </p>
                                ) : (
                                  <MarkdownMessage content={msg.contenu} />
                                )}
                              </div>

                              <div
                                className={`msg-tools flex items-center gap-2 mt-1.5 px-1 ${
                                  isUser ? "flex-row-reverse" : ""
                                }`}
                              >
                                {heure && (
                                  <span className="text-[11px] text-surface-400">
                                    {heure}
                                  </span>
                                )}
                                <button
                                  onClick={() => copierMessage(msg.contenu, id)}
                                  className="flex items-center gap-1 text-[11px] text-surface-400 hover:text-brand-600 transition-colors"
                                  title="Copier le message"
                                >
                                  {copie ? (
                                    <>
                                      <Check size={13} />
                                      Copié
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={13} />
                                      Copier
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {loading && (
                    <div className="flex gap-3 max-w-3xl fade-in">
                      <div className="w-8 h-8 rounded-full bg-white border border-surface-200 flex items-center justify-center text-brand-600 shadow-sm flex-shrink-0">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white border border-surface-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                        <div className="flex items-center gap-2.5">
                          <div className="flex gap-1.5 items-center h-5">
                            <span
                              className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"
                              style={{ animationDelay: "-0.32s" }}
                            />
                            <span
                              className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"
                              style={{ animationDelay: "-0.16s" }}
                            />
                            <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" />
                          </div>
                          <span className="text-xs text-surface-400">
                            L'assistant rédige une réponse…
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-surface-200 bg-white px-4 sm:px-6 py-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    envoyerMessage();
                  }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="flex items-end gap-2 rounded-2xl border border-surface-200 bg-surface-50 p-2 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 focus-within:bg-white transition-all">
                    <textarea
                      ref={inputRef}
                      rows={1}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          !e.nativeEvent.isComposing
                        ) {
                          e.preventDefault();
                          envoyerMessage();
                        }
                      }}
                      placeholder="Posez votre question sur une démarche, un dossier ou une pièce à fournir…"
                      className="flex-1 resize-none bg-transparent border-0 px-2 py-2 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-0 focus:shadow-none"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || loading}
                      aria-label="Envoyer le message"
                      className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-brand-700 to-brand-500 hover:from-brand-800 hover:to-brand-600 text-white rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Send size={17} />
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[11px] text-surface-400">
                    Entrée pour envoyer · Maj + Entrée pour un saut de ligne
                  </p>
                </form>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 flex items-center justify-center mb-6 shadow-xl shadow-brand-500/25 animate-float">
                <Bot size={44} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-surface-800 mb-2">
                Bienvenue dans l'assistant IA
              </h2>
              <p className="text-surface-500 mb-8 max-w-md">
                Sélectionnez une conversation existante ou commencez-en une
                nouvelle pour obtenir de l'aide.
              </p>
              <button
                onClick={creerNouvelleConversation}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-700 to-brand-500 hover:from-brand-800 hover:to-brand-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <MessageSquarePlus size={20} />
                Commencer une discussion
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
