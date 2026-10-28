
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Avaliar.css";

function Avaliar() {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");

  function handleEnviar(event) {
    event.preventDefault();

    if (nota === 0) {
      alert("Selecione uma nota de 1 a 5 estrelas.");
      return;
    }

    alert("Avaliação preenchida com sucesso!");

    setNota(0);
    setComentario("");
  }

  return (
    <div className="tela-avaliar">
      <header className="avaliar-cabecalho">
        <h1>Cardápio Digital Escolar</h1>

        <nav>
          <Link to="/home">Início</Link>
          <Link to="/cardapio">Cardápio</Link>
          <Link to="/avaliar">Avaliar</Link>
          <Link to="/sugerir">Sugerir</Link>
        </nav>
      </header>

      <main className="avaliar-container">
        <h2>Avaliar Refeição</h2>

        <form onSubmit={handleEnviar}>
          <div className="avaliar-campo">
            <label htmlFor="refeicao">
              Qual refeição você deseja avaliar?
            </label>

            <input
              type="text"
              id="refeicao"
              placeholder="Ex.: Arroz, feijão e frango"
              required
            />
          </div>

          <div className="avaliar-estrelas">
            <p>Como você avalia essa refeição?</p>

            <div className="estrelas">
              {[1, 2, 3, 4, 5].map((estrela) => (
                <button
                  key={estrela}
                  type="button"
                  className={
                    estrela <= nota
                      ? "estrela selecionada"
                      : "estrela"
                  }
                  onClick={() => setNota(estrela)}
                  aria-label={`${estrela} ${
                    estrela === 1 ? "estrela" : "estrelas"
                  }`}
                  aria-pressed={estrela === nota}
                >
                  ★
                </button>
              ))}
            </div>

            <p className="texto-nota">
              {nota === 0
                ? "Selecione de 1 a 5 estrelas"
                : `Você selecionou ${nota} ${
                    nota === 1 ? "estrela" : "estrelas"
                  }`}
            </p>
          </div>

          <div className="avaliar-campo">
            <label htmlFor="comentario">
              Deixe seu comentário
            </label>

            <textarea
              id="comentario"
              value={comentario}
              onChange={(event) =>
                setComentario(event.target.value)
              }
              placeholder="Conte o que achou da refeição..."
              rows="5"
              maxLength={500}
            />

            <small>{comentario.length}/500 caracteres</small>
          </div>

          <button type="submit" className="botao-enviar">
            Enviar avaliação
          </button>

          <Link to="/home" className="link-voltar">
            Voltar para o Início
          </Link>
        </form>
      </main>
    </div>
  );
}

export default Avaliar;
