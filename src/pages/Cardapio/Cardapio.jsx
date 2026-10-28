import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cardapio.css";

function Cardapio() {
  const [refeicoes, setRefeicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarRefeicoes();
  }, []);

  async function buscarRefeicoes() {
    try {
      const resposta = await fetch("http://localhost:3000/refeicoes");

      if (!resposta.ok) {
        throw new Error("Erro ao buscar refeições");
      }

      const dados = await resposta.json();
      setRefeicoes(dados);
    } catch (error) {
      setErro("Não foi possível carregar as refeições.");
    } finally {
      setCarregando(false);
    }
  }

  async function excluirRefeicao(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta refeição?"
    );

    if (!confirmar) return;

    try {
      const resposta = await fetch(
        `http://localhost:3000/refeicoes/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao excluir refeição");
      }

      // Remove a refeição da tela sem precisar atualizar a página
      setRefeicoes(
        refeicoes.filter((refeicao) => refeicao.id_refeicao !== id)
      );
    } catch (error) {
      alert("Erro ao excluir a refeição.");
    }
  }

  return (
    <div className="pagina">

      <header className="cabecalho">
        <div className="logo">
        Cardápio Digital Escolar
        </div>

        <nav>
          <Link to="/home">Início</Link>
          <Link to="/cardapio" className="ativo">Cardápio</Link>
          <Link to="/avaliar">Avaliar</Link>
          <Link to="/sugerir">Sugerir</Link>
        </nav>
      </header>

      <main className="conteudo">

        <div className="titulo-cardapio">
          <div>
            <h1>Cardápio</h1>
            <p>Confira as refeições cadastradas.</p>
          </div>

          <Link to="/criar-refeicao" className="botao-criar">
            + Criar refeição
          </Link>
        </div>

        {carregando && (
          <p className="mensagem">Carregando refeições...</p>
        )}

        {erro && (
          <p className="erro">{erro}</p>
        )}

        {!carregando && !erro && refeicoes.length === 0 && (
          <div className="sem-refeicoes">
            <p>Nenhuma refeição cadastrada.</p>

            <Link to="/criar-refeicao">
              Cadastrar primeira refeição
            </Link>
          </div>
        )}

        <div className="lista-refeicoes">

          {refeicoes.map((refeicao) => (

            <div className="card-refeicao" key={refeicao.id_refeicao}>

              <div className="informacoes-refeicao">

                <h2>{refeicao.nomeRefeicao}</h2>

                <p className="descricao">
                  {refeicao.descricao}
                </p>

                <span className="categoria">
                  {refeicao.categoria}
                </span>

              </div>

              <div className="acoes">

                <Link to={`/gerenciarRefeicao/${refeicao.id_refeicao}`}
                  className="botao-editar"
                >
                  Editar
                </Link>

                <button
                  className="botao-excluir"
                  onClick={() =>
                    excluirRefeicao(refeicao.id_refeicao)
                  }
                >
                  Excluir
                </button>

              </div>

            </div>

          ))}

        </div>

      </main>

      <footer>
      </footer>

    </div>
  );
}

export default Cardapio;