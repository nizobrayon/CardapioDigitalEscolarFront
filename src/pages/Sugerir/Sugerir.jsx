
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Sugerir.css";

function Sugerir() {
  const [nomePrato, setNomePrato] = useState("");
  const [descricao, setDescricao] = useState("");

  function handleEnviar(event) {
    event.preventDefault();

    alert("Sugestão enviada com sucesso!");

    setNomePrato("");
    setDescricao("");
  }

  return (
    <div className="tela-sugerir">
      <header className="sugerir-cabecalho">
        <h1>Cardápio Digital Escolar</h1>

        <nav>
          <Link to="/">Início</Link>
          <Link to="/cardapio">Cardápio</Link>
        </nav>
      </header>

      <main className="sugerir-container">
        <h2>Sugerir Refeição</h2>

        <p className="sugerir-texto">
          Tem uma ideia de prato para o cardápio escolar?
          Compartilhe sua sugestão conosco!
        </p>

        <form onSubmit={handleEnviar}>
          <div className="sugerir-campo">
            <label htmlFor="nomePrato">
              Nome do prato sugerido
            </label>

            <input
              type="text"
              id="nomePrato"
              value={nomePrato}
              onChange={(event) =>
                setNomePrato(event.target.value)
              }
              placeholder="Ex.: Macarrão à bolonhesa"
              required
            />
          </div>

          <div className="sugerir-campo">
            <label htmlFor="descricao">
              Descrição breve do prato
            </label>

            <textarea
              id="descricao"
              value={descricao}
              onChange={(event) =>
                setDescricao(event.target.value)
              }
              placeholder="Conte quais ingredientes o prato teria..."
              rows="4"
              maxLength={300}
              required
            />

            <small>{descricao.length}/300 caracteres</small>
          </div>

          <button type="submit" className="botao-sugerir">
            Enviar Sugestão
          </button>

          <Link to="/cardapio" className="sugerir-voltar">
            Voltar para o cardápio
          </Link>
        </form>
      </main>
    </div>
  );
}

export default Sugerir;
