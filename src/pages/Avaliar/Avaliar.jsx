import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getIdUsuario, getUsuarioLogado } from "../../services/auth";
import "./Avaliar.css";

function Avaliar() {
  const [usuario] = useState(() => getUsuarioLogado());
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

    const idUsuario = getIdUsuario(usuario);
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

  const idUsuario = getIdUsuario(usuario);

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

        {!idUsuario && (
          <p className="texto-nota">
            Você precisa estar logado como aluno para enviar uma avaliação.{" "}
            <Link to="/loginAluno">Entrar</Link>
          </p>
        )}

        <form onSubmit={handleEnviar}>
          <div className="avaliar-campo">
            <label htmlFor="refeicao">Qual refeição você deseja avaliar?</label>

            <select
              id="refeicao"
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

          <div className="avaliar-estrelas">
            <p>Como você avalia essa refeição?</p>

            <div className="estrelas">
              {[1, 2, 3, 4, 5].map((estrela) => (
                <button
                  key={estrela}
                  type="button"
                  className={estrela <= nota ? "estrela selecionada" : "estrela"}
                  onClick={() => setNota(estrela)}
                  aria-label={`${estrela} ${estrela === 1 ? "estrela" : "estrelas"}`}
                  aria-pressed={estrela === nota}
                >
                  ★
                </button>
              ))}
            </div>

            <p className="texto-nota">
              {nota === 0
                ? "Selecione de 1 a 5 estrelas"
                : `Você selecionou ${nota} ${nota === 1 ? "estrela" : "estrelas"}`}
            </p>
          </div>

          <div className="avaliar-campo">
            <label htmlFor="comentario">Deixe seu comentário</label>

            <textarea
              id="comentario"
              value={comentario}
              onChange={(event) => setComentario(event.target.value)}
              placeholder="Conte o que achou da refeição..."
              rows="5"
              maxLength={500}
            />

            <small>{comentario.length}/500 caracteres</small>
          </div>

          <button type="submit" className="botao-enviar" disabled={carregando}>
            {carregando ? "Enviando..." : "Enviar avaliação"}
          </button>

          {mensagem && <p className="texto-nota">{mensagem}</p>}

          <Link to="/home" className="link-voltar">
            Voltar para o Início
          </Link>
        </form>
      </main>
    </div>
  );
}

export default Avaliar;
