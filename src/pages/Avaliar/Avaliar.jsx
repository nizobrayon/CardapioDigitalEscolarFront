import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUsuarioLogado, getTipoUsuario } from "../../services/auth";
import "./Avaliar.css";

function Avaliar() {
  const location = useLocation();
  const usuarioDoState = location.state?.usuario;
  const usuarioLogado = getUsuarioLogado();
  const usuario = usuarioDoState || usuarioLogado;
  const tipoUsuario = usuario?.tipoUsuario || getTipoUsuario() || null;
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [id_refeicao, setId_refeicao] = useState("");
  const [refeicoes, setRefeicoes] = useState([]);
  const [minhasAvaliacoes, setMinhasAvaliacoes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [excluindoId, setExcluindoId] = useState(null);

  const idUsuario = usuario?.idusuario || usuario?.idUsuario;

  useEffect(() => {
    async function buscar() {
      try {
        const r = await fetch("http://localhost:3000/refeicoes");
        const dados = await r.json();
        setRefeicoes(Array.isArray(dados) ? dados : dados.refeicoes || []);
      } catch {
        setMensagem("Não foi possível carregar refeições.");
      }
    }
    buscar();
  }, []);

  useEffect(() => {
    if (!idUsuario) return;
    fetch("http://localhost:3000/feedback")
      .then((r) => r.json())
      .then((dados) => {
        const lista = Array.isArray(dados) ? dados : [];
        const minhas = lista.filter(
          (a) =>
            a.nomeusuario === usuario?.nomeusuario &&
            a.raaluno === usuario?.raaluno
        );
        setMinhasAvaliacoes(minhas);
      })
      .catch(() => {
        setMinhasAvaliacoes([]);
      });
  }, [idUsuario, usuario]);

  console.log("Dados enviados:", {
  idUsuario,
  id_refeicao: Number(id_refeicao),
  nota,
  comentario,
});

  async function handleEnviar(event) {
    event.preventDefault();
    setMensagem("");

    if (nota === 0) {
      setMensagem("Selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    if (!id_refeicao) {
      setMensagem("Selecione a refeição.");
      return;
    }
    if (!idUsuario) {
      setMensagem("Faça login como aluno para avaliar.");
      return;
    }

    try {
      setCarregando(true);
      const resposta = await fetch("http://localhost:3000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUsuario,
          id_refeicao: Number(id_refeicao),
          nota,
          comentario,
        }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.mensagem || "Erro ao enviar.");
      setMensagem(dados.mensagem || "Avaliação registrada com sucesso!");
      setNota(0);
      setComentario("");
      setId_refeicao("");
    } catch (erro) {
      setMensagem(
        erro.message === "Failed to fetch"
          ? "Não foi possível conectar ao servidor."
          : erro.message
      );
    } finally {
      setCarregando(false);
    }
  }

  async function excluirAvaliacao(id) {
    if (!window.confirm("Tem certeza que deseja excluir esta avaliação?")) {
      return;
    }
    if (!idUsuario) return;

    try {
      setExcluindoId(id);
      const resposta = await fetch(`http://localhost:3000/feedback/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao excluir.");
      }
      setMensagem(dados.mensagem || "Avaliação excluída com sucesso!");
      setMinhasAvaliacoes(minhasAvaliacoes.filter((a) => a.idfeedback !== id));
    } catch (erro) {
      setMensagem(erro.message || "Não foi possível excluir a avaliação.");
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <div className="page avaliar-page">
      <header className="app-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🍽️</span>
          Cardápio Digital Escolar
        </Link>
        <nav className="app-nav">
          {tipoUsuario === "nutricionista" ? (
            <>
              <Link to="/criar-refeicao">Criar refeição</Link>
              <Link to="/avaliacoes-alunos">Avaliações</Link>
              <Link to="/sugestoes-alunos">Sugestões</Link>
              <Link to="/perfil">Perfil</Link>
            </>
          ) : (
            <>
              <Link to="/home">Início</Link>
              <Link to="/cardapio">Cardápio</Link>
              <Link to="/avaliar" className="ativo">Avaliar</Link>
              <Link to="/sugerir">Sugerir</Link>
              <Link to="/perfil">Perfil</Link>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="titulo-secao flex items-center justify-between gap-2 mb-6">
            <div>
              <h1>Avaliar Refeição</h1>
              <p className="text-muted">Dê sua nota e deixe seu comentário.</p>
            </div>
          </div>

          {mensagem && (
            <div className={`alert ${mensagem.includes("sucesso") ? "alert-success" : "alert-error"}`}>
              {mensagem}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="card form-card">
              <form onSubmit={handleEnviar} className="form">
                <div className="form-group">
                  <label htmlFor="refeicao">Qual refeição você deseja avaliar?</label>
                  <select
                    id="refeicao"
                    className="form-control"
                    value={id_refeicao}
                    onChange={(e) => setId_refeicao(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma refeição</option>
                    {refeicoes.map((r) => (
                      <option key={r.id_refeicao} value={r.id_refeicao}>
                        {r.nomeRefeicao || r.nomerefeicao}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group text-center">
                  <p className="font-semibold mb-4">
                    Como você avalia essa refeição?
                  </p>
                  <div className="estrelas justify-center">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                      <button
                        key={estrela}
                        type="button"
                        className={`estrela ${estrela <= nota ? "selecionada" : ""}`}
                        onClick={() => setNota(estrela)}
                        aria-label={`${estrela} ${estrela === 1 ? "estrela" : "estrelas"}`}
                        aria-pressed={estrela === nota}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <p className="texto-nota mt-2">
                    {nota === 0
                      ? "Selecione de 1 a 5 estrelas"
                      : `Você selecionou ${nota} ${nota === 1 ? "estrela" : "estrelas"}`}
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="comentario">Deixe seu comentário</label>
                  <textarea
                    id="comentario"
                    className="form-control"
                    value={comentario}
                    onChange={(event) => setComentario(event.target.value)}
                    placeholder="Conte o que achou da refeição..."
                    rows="5"
                    maxLength={500}
                  />
                  <span className="form-text">
                    {comentario.length}/500 caracteres
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={carregando}
                >
                  {carregando ? "Enviando..." : "Enviar avaliação"}
                </button>
              </form>

              <Link to="/home" className="btn btn-outline btn-full mt-4">
                Voltar para o Início
              </Link>
            </div>

            <div className="card minhas-avaliacoes-card">
              <div className="text-center mb-6">
                <h2 className="mb-2">Minhas avaliações</h2>
              </div>

              {carregando && (
                <p className="text-muted text-center">Carregando...</p>
              )}

              {!carregando && minhasAvaliacoes.length === 0 && (
                <div className="empty-state">
                  <h3>Nenhuma avaliação ainda</h3>
                  <p className="text-muted">
                    Avalie uma refeição para ver aqui.
                  </p>
                </div>
              )}

              {!carregando && minhasAvaliacoes.length > 0 && (
                <div className="lista-minhas-avaliacoes">
                  {minhasAvaliacoes.map((av) => (
                    <div className="card card-minha-avaliacao" key={av.idfeedback}>
                      <div className="avaliacao-info">
                        <span className="badge">
                          {av.notafeedback} / 5
                        </span>
                        <h4>{av.nomerefeicao || "Refeição"}</h4>
                        {av.comentariofeedback && (
                          <p className="text-muted text-sm mt-2">
                            {av.comentariofeedback}
                          </p>
                        )}
                        <p className="text-xs text-muted mt-2">
                          {new Date(av.datafeedback).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <button
                        className="btn btn-outline btn-sm excluir-btn"
                        onClick={() => excluirAvaliacao(av.idfeedback)}
                        disabled={excluindoId === av.idfeedback}
                      >
                        {excluindoId === av.idfeedback ? "Excluindo..." : "Excluir"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        Cardápio Digital Escolar 2026
      </footer>
    </div>
  );
}

export default Avaliar;
