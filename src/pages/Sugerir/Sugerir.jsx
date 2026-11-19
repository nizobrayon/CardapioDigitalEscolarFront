import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sugerir.css";

function Sugerir() {
  const location = useLocation();
  const usuario = location.state?.usuario;
  const [nomePrato, setNomePrato] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleEnviar(event) {
    event.preventDefault();
    setMensagem("");

    const idUsuario = usuario?.idusuario || usuario?.idUsuario;
    if (!idUsuario) {
      setMensagem("Faça login como aluno para enviar sugestão.");
      return;
    }

    try {
      setCarregando(true);
      const resposta = await fetch("http://localhost:3000/sugestoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUsuario,
          nomePrato,
          descricao,
        }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.mensagem || "Erro ao enviar.");
      setMensagem(dados.mensagem || "Sugestão enviada com sucesso!");
      setNomePrato("");
      setDescricao("");
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
    <div className="page sugerir-page">
      <header className="app-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🍽️</span>
          Cardápio Digital Escolar
        </Link>
        <nav className="app-nav">
          <Link to="/">Início</Link>
          <Link to="/cardapio">Cardápio</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="card max-w-md mx-auto">
            <div className="text-center mb-6">
              <h1 className="mb-2">Sugerir Refeição</h1>
              <p className="text-muted">
                Tem uma ideia de prato para o cardápio escolar?
                Compartilhe sua sugestão conosco!
              </p>
            </div>

            {mensagem && (
              <div className={`alert ${mensagem.includes("sucesso") ? "alert-success" : "alert-error"}`}>
                {mensagem}
              </div>
            )}

            <form onSubmit={handleEnviar} className="form">
              <div className="form-group">
                <label htmlFor="nomePrato">Nome do prato sugerido</label>
                <input
                  type="text"
                  id="nomePrato"
                  className="form-control"
                  value={nomePrato}
                  onChange={(event) => setNomePrato(event.target.value)}
                  placeholder="Ex.: Macarrão à bolonhesa"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição breve do prato</label>
                <textarea
                  id="descricao"
                  className="form-control"
                  value={descricao}
                  onChange={(event) => setDescricao(event.target.value)}
                  placeholder="Conte quais ingredientes o prato teria..."
                  rows="4"
                  maxLength={300}
                  required
                />
                <span className="form-text">
                  {descricao.length}/300 caracteres
                </span>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={carregando}>
                {carregando ? "Enviando..." : "Enviar Sugestão"}
              </button>
            </form>

            <Link to="/cardapio" className="btn btn-outline btn-full mt-4">
              Voltar para o cardápio
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

export default Sugerir;
