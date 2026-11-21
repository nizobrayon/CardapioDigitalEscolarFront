import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SugestoesAlunos.css";

function SugestoesAlunos() {
  const [sugestoes, setSugestoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/sugestoes")
      .then((r) => r.json())
      .then((dados) => {
        const lista = Array.isArray(dados) ? dados : [];
        setSugestoes(lista);
        setCarregando(false);
      })
      .catch(() => {
        setErro("Não foi possível carregar as sugestões.");
        setCarregando(false);
      });
  }, []);

  async function alterarStatus(id, novoStatus) {
    try {
      const resposta = await fetch(
        `http://localhost:3000/sugestoes/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statusSugestao: novoStatus }),
        }
      );

      if (!resposta.ok) {
        throw new Error("Não foi possível atualizar o status.");
      }

      setMensagem(`Sugestão ${novoStatus.toLowerCase()} com sucesso!`);
      setSugestoes(
        sugestoes.map((s) =>
          s.idsugestao === id ? { ...s, statussugestao: novoStatus } : s
        )
      );
    } catch {
      setMensagem("Erro ao atualizar status da sugestão.");
    }
  }

  const total = sugestoes.length;
  const pendentes = sugestoes.filter(
    (s) => s.statussugestao === "Pendente"
  ).length;

  return (
    <div className="page sugestoes-alunos-page">
      <header className="app-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🍽️</span>
          Cardápio Digital Escolar
        </Link>
          <nav className="app-nav">
            <Link to="/criar-refeicao">Criar refeição</Link>
            <Link to="/gerenciar-refeicoes">Gerenciar refeições</Link>
            <Link to="/avaliacoes-alunos">Avaliações</Link>
            <Link to="/sugestoes-alunos" className="ativo">Sugestões</Link>
          </nav>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="titulo-secao flex items-center justify-between gap-2 mb-6">
            <div>
              <h1>Sugestões dos Alunos</h1>
              <p className="text-muted">
                Gerencie as sugestões enviadas pelos alunos para o cardápio.
              </p>
            </div>
          </div>

          {carregando && (
            <div className="text-center py-10">
              <p className="text-muted">Carregando sugestões...</p>
            </div>
          )}

          {erro && (
            <div className="alert alert-error">{erro}</div>
          )}

          {mensagem && (
            <div className="alert alert-success mb-6">{mensagem}</div>
          )}

          {!carregando && !erro && (
            <>
              <div className="resumo-grid grid grid-cols-2 gap-4 mb-8">
                <div className="card resumo-card">
                  <div className="text-center">
                    <h3 className="mb-1">Total de sugestões</h3>
                    <p className="text-muted text-lg font-bold">{total}</p>
                  </div>
                </div>
                <div className="card resumo-card">
                  <div className="text-center">
                    <h3 className="mb-1">Pendentes</h3>
                    <p className="text-muted text-lg font-bold">{pendentes}</p>
                  </div>
                </div>
              </div>

              {!carregando && !erro && sugestoes.length === 0 && (
                <div className="empty-state">
                  <h3>Nenhuma sugestão enviada</h3>
                  <p className="text-muted">
                    Quando os alunos enviarem sugestões, elas aparecerão aqui.
                  </p>
                </div>
              )}

              {!carregando && !erro && sugestoes.length > 0 && (
                <div className="lista-sugestoes">
                  {sugestoes.map((s) => (
                    <div className="card card-sugestao" key={s.idsugestao}>
                      <div className="sugestao-header flex justify-between items-start">
                        <div>
                          <h3>{s.nomecomidasugestao}</h3>
                          <p className="text-sm text-muted">
                            Aluno:{" "}
                            <strong>{s.nomeusuario || "—"}</strong>
                            {s.raaluno ? ` (RA: ${s.raaluno})` : ""}
                          </p>
                          <p className="text-sm text-muted">
                            {new Date(s.datasugestao).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>
                        <div className="status-badge">
                          <span className={`badge ${classeStatus(s.statussugestao)}`}>
                            {s.statussugestao}
                          </span>
                        </div>
                      </div>
                      <div className="descricao-sugestao mt-4">
                        <p className="text-muted">{s.descricaosugestao}</p>
                      </div>
                      {s.statussugestao === "Pendente" && (
                        <div className="acoes-status mt-4 flex gap-2">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => alterarStatus(s.idsugestao, "Aceita")}
                          >
                            Aprovar
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => alterarStatus(s.idsugestao, "Recusada")}
                          >
                            Recusar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        Cardápio Digital Escolar 2026
      </footer>
    </div>
  );
}

function classeStatus(status) {
  switch (status) {
    case "Pendente":
      return "badge-pending";
    case "Aceita":
      return "badge-aceita";
    case "Recusada":
      return "badge-recusada";
    default:
      return "badge-pending";
  }
}

export default SugestoesAlunos;
