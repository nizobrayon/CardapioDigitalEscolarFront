import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Avaliar.css";

function Avaliar() {
  const location = useLocation();
  const usuario = location.state?.usuario;
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [idRefeicao, setIdRefeicao] = useState("");
  const [refeicoes, setRefeicoes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

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

  async function handleEnviar(event) {
    event.preventDefault();
    setMensagem("");

    if (nota === 0) {
      setMensagem("Selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    if (!idRefeicao) {
      setMensagem("Selecione a refeição.");
      return;
    }

    const idUsuario = usuario?.idusuario || usuario?.idUsuario;
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
          idRefeicao: Number(idRefeicao),
          nota,
          comentario,
        }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.mensagem || "Erro ao enviar.");
      setMensagem(dados.mensagem || "Avaliação registrada com sucesso!");
      setNota(0);
      setComentario("");
      setIdRefeicao("");
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

  return (
    <div className="page avaliar-page">
      <header className="app-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🍽️</span>
          Cardápio Digital Escolar
        </Link>
        <nav className="app-nav">
          <Link to="/">Início</Link>
          <Link to="/cardapio">Cardápio</Link>
          <Link to="/avaliar" className="ativo">Avaliar</Link>
          <Link to="/sugerir">Sugerir</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="card max-w-md mx-auto">
            <div className="text-center mb-6">
              <h1 className="mb-2">Avaliar Refeição</h1>
              <p className="text-muted">Dê sua nota e deixe seu comentário.</p>
            </div>

            {mensagem && (
              <div className={`alert ${mensagem.includes("sucesso") ? "alert-success" : "alert-error"}`}>
                {mensagem}
              </div>
            )}

            <form onSubmit={handleEnviar} className="form">
              <div className="form-group">
                <label htmlFor="refeicao">Qual refeição você deseja avaliar?</label>
                <select
                  id="refeicao"
                  className="form-control"
                  value={idRefeicao}
                  onChange={(e) => setIdRefeicao(e.target.value)}
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
                <p className="font-semibold mb-4">Como você avalia essa refeição?</p>
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

              <button type="submit" className="btn btn-primary btn-full" disabled={carregando}>
                {carregando ? "Enviando..." : "Enviar avaliação"}
              </button>
            </form>

            <Link to="/home" className="btn btn-outline btn-full mt-4">
              Voltar para o Início
            </Link>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        Cardápio Digital Escolar © 2026
      </footer>
    </div>
  );
}

export default Avaliar;
