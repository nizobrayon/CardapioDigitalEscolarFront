import { useState } from "react";
import { Link } from "react-router-dom";
import { getIdUsuario, getUsuarioLogado } from "../../services/auth";
import "./Sugerir.css";

function Sugerir() {
  const [usuario] = useState(() => getUsuarioLogado());
  const [nomePrato, setNomePrato] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleEnviar(event) {
    event.preventDefault();
    setMensagem("");

    const idUsuario = getIdUsuario(usuario);
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

  const idUsuario = getIdUsuario(usuario);

  return (
    <div className="tela-sugerir">
      <header className="sugerir-cabecalho">
        <h1>Cardápio Digital Escolar</h1>

        <nav>
          <Link to="/home">Início</Link>
          <Link to="/cardapio">Cardápio</Link>
          <Link to="/avaliar">Avaliar</Link>
          <Link to="/sugerir">Sugerir</Link>
        </nav>
      </header>

      <main className="sugerir-container">
        <h2>Sugerir Refeição</h2>

        <p className="sugerir-texto">
          Tem uma ideia de prato para o cardápio escolar? Compartilhe sua sugestão conosco!
        </p>

        {!idUsuario && (
          <p className="sugerir-texto">
            Você precisa estar logado como aluno para enviar uma sugestão.{" "}
            <Link to="/loginAluno">Entrar</Link>
          </p>
        )}

        <form onSubmit={handleEnviar}>
          <div className="sugerir-campo">
            <label htmlFor="nomePrato">Nome do prato sugerido</label>

            <input
              type="text"
              id="nomePrato"
              value={nomePrato}
              onChange={(event) => setNomePrato(event.target.value)}
              placeholder="Ex.: Macarrão à bolonhesa"
              required
            />
          </div>

          <div className="sugerir-campo">
            <label htmlFor="descricao">Descrição breve do prato</label>

            <textarea
              id="descricao"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Conte quais ingredientes o prato teria..."
              rows="4"
              maxLength={300}
              required
            />

            <small>{descricao.length}/300 caracteres</small>
          </div>

          <button type="submit" className="botao-sugerir" disabled={carregando}>
            {carregando ? "Enviando..." : "Enviar Sugestão"}
          </button>

          {mensagem && <p className="sugerir-texto">{mensagem}</p>}

          <Link to="/cardapio" className="sugerir-voltar">
            Voltar para o cardápio
          </Link>
        </form>
      </main>
    </div>
  );
}

export default Sugerir;
