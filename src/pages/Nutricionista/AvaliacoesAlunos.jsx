import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AvaliacoesAlunos.css";

function AvaliacoesAlunos() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [refeicoes, setRefeicoes] = useState([]);
  const [filtroRefeicao, setFiltroRefeicao] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/feedback").then((r) => r.json()),
      fetch("http://localhost:3000/refeicoes").then((r) => r.json()),
    ])
      .then(([feedbackData, refeicoesData]) => {
        const lista = Array.isArray(feedbackData) ? feedbackData : [];
        const refeicoesLista = Array.isArray(refeicoesData) ? refeicoesData : [];
        setAvaliacoes(lista);
        setRefeicoes(refeicoesLista);
        setCarregando(false);
      })
      .catch(() => {
        setErro("Não foi possível carregar as avaliações.");
        setCarregando(false);
      });
  }, []);

  const refeicaoPorId = {};
  refeicoes.forEach((r) => {
    const id = r.id_refeicao ?? r.idrefeicao ?? r.id;
    if (id != null) refeicaoPorId[id] = r;
  });

  const obterNomeRefeicao = (id) => {
    const r = refeicaoPorId[id];
    if (!r) return "—";
    return r.nomeRefeicao ?? r.nomerefeicao ?? r.nome ?? "—";
  };

  const avaliacoesFiltradas =
    filtroRefeicao === ""
      ? avaliacoes
      : avaliacoes.filter(
          (a) =>
            (a.idrefeicao ?? a.id_refeicao ?? a.idRefeicao) == filtroRefeicao
        );

  const total = avaliacoes.length;
  const media =
    total > 0
      ? (avaliacoes.reduce((soma, a) => soma + Number(a.notafeedback || 0), 0) /
          total).toFixed(1)
      : "0,0";

  return (
    <div className="page avaliacoes-alunos-page">
      <header className="app-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🍽️</span>
          Cardápio Digital Escolar
        </Link>
          <nav className="app-nav">
            <Link to="/criar-refeicao">Criar refeição</Link>
            <Link to="/gerenciar-refeicoes">Gerenciar refeições</Link>
            <Link to="/avaliacoes-alunos" className="ativo">Avaliações</Link>
            <Link to="/sugestoes-alunos">Sugestões</Link>
          </nav>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="titulo-secao flex items-center justify-between gap-2 mb-6">
            <div>
              <h1>Avaliações dos Alunos</h1>
              <p className="text-muted">
                Acompanhe o feedback dos alunos sobre as refeições.
              </p>
            </div>
          </div>

          {carregando && (
            <div className="text-center py-10">
              <p className="text-muted">Carregando avaliações...</p>
            </div>
          )}

          {erro && (
            <div className="alert alert-error">{erro}</div>
          )}

          {!carregando && !erro && (
            <>
              <div className="resumo-grid grid grid-cols-3 gap-4 mb-8">
                <div className="card resumo-card">
                  <div className="text-center">
                    <span className="text-3xl block mb-2">⭐</span>
                    <h3 className="mb-1">Média geral</h3>
                    <p className="text-muted text-lg font-bold">{media}</p>
                  </div>
                </div>
                <div className="card resumo-card">
                  <div className="text-center">
                    <span className="text-3xl block mb-2">📊</span>
                    <h3 className="mb-1">Total de avaliações</h3>
                    <p className="text-muted text-lg font-bold">{total}</p>
                  </div>
                </div>
                <div className="card resumo-card">
                  <div className="text-center">
                    <span className="text-3xl block mb-2">🍽️</span>
                    <h3 className="mb-1">Refeições avaliadas</h3>
                    <p className="text-muted text-lg font-bold">
                      {new Set(avaliacoes.map((a) => a.idrefeicao)).size}
                    </p>
                  </div>
                </div>
              </div>

              <div className="filtro-card card mb-6">
                <div className="form-group">
                  <label htmlFor="filtroRefeicao">Filtrar por refeição</label>
                  <select
                    id="filtroRefeicao"
                    className="form-control"
                    value={filtroRefeicao}
                    onChange={(e) => setFiltroRefeicao(e.target.value)}
                  >
                    <option value="">Todas as refeições</option>
                    {refeicoes.map((r) => {
                      const id = r.id_refeicao ?? r.idrefeicao ?? r.id;
                      const nome =
                        r.nomeRefeicao ?? r.nomerefeicao ?? r.nome ?? "Refeição";
                      return (
                        <option key={id} value={id}>
                          {nome}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {!carregando && !erro && avaliacoesFiltradas.length === 0 && (
                <div className="empty-state">
                  <span className="empty-state-icon">📭</span>
                  <h3>Nenhuma avaliação encontrada</h3>
                  <p className="text-muted">
                    Não há avaliações para os filtros selecionados.
                  </p>
                </div>
              )}

              {!carregando && !erro && avaliacoesFiltradas.length > 0 && (
                <div className="lista-avaliacoes">
                  {avaliacoesFiltradas.map((av) => (
                    <div className="card card-avaliacao" key={av.idfeedback}>
                      <div className="avaliacao-header flex justify-between items-start">
                        <div>
                          <h3>{av.nomeusuario || "Aluno"}</h3>
                            <p className="text-sm text-muted">
                              RA: {av.raaluno || "—"} · Refeição:
                              {obterNomeRefeicao(av.idrefeicao ?? av.id_refeicao)}
                            </p>
                        </div>
                        <div className="text-right">
                          <div className="nota-destaque">
                            {av.notafeedback} / 5
                          </div>
                          <p className="text-sm text-muted">
                            {new Date(av.datafeedback).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>
                      </div>
                      {av.comentariofeedback && (
                        <div className="comentario mt-4">
                          <p>{av.comentariofeedback}</p>
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
        Cardápio Digital Escolar © 2026
      </footer>
    </div>
  );
}

export default AvaliacoesAlunos;
