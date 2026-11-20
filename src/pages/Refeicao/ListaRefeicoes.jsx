import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ListaRefeicoes.css";

function ListaRefeicoes() {
  const [refeicoes, setRefeicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const buscarRefeicoes = async () => {
    try {
      const resposta = await fetch("http://localhost:3000/refeicoes");

      if (!resposta.ok) {
        throw new Error("Erro ao buscar refeições");
      }

      const dados = await resposta.json();
      setRefeicoes(Array.isArray(dados) ? dados : []);
    } catch {
      setErro("Não foi possível carregar as refeições.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    (async () => {
      await buscarRefeicoes();
    })();
  }, []);

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

      setRefeicoes(
        refeicoes.filter((refeicao) => refeicao.id_refeicao !== id)
      );
    } catch {
      alert("Erro ao excluir a refeição.");
    }
  }

  if (carregando) {
    return (
      <div className="page lista-refeicoes-page">
        <header className="app-header">
          <Link to="/" className="logo">
            <span className="logo-icon">🍽️</span>
            Cardápio Digital Escolar
          </Link>
          <nav className="app-nav">
            <Link to="/criar-refeicao">Criar refeição</Link>
            <Link to="/avaliacoes-alunos">Avaliações</Link>
            <Link to="/sugestoes-alunos">Sugestões</Link>
            <Link to="/perfil">Perfil</Link>
          </nav>
        </header>
        <main className="main-content">
          <div className="container">
            <div className="card text-center py-10">
              <p className="text-muted">Carregando refeições...</p>
            </div>
          </div>
        </main>
        <footer className="app-footer">
          Cardápio Digital Escolar © 2026
        </footer>
      </div>
    );
  }

  return (
    <div className="page lista-refeicoes-page">
      <header className="app-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🍽️</span>
          Cardápio Digital Escolar
        </Link>
        <nav className="app-nav">
          <Link to="/criar-refeicao">Criar refeição</Link>
          <Link to="/gerenciar-refeicoes" className="ativo">
            Gerenciar refeições
          </Link>
          <Link to="/avaliacoes-alunos">Avaliações</Link>
          <Link to="/sugestoes-alunos">Sugestões</Link>
          <Link to="/perfil">Perfil</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="titulo-secao flex items-center justify-between gap-2 mb-6">
            <div>
              <h1>Gerenciar Refeições</h1>
              <p className="text-muted">
                Liste, edite e exclua as refeições cadastradas no cardápio.
              </p>
            </div>
            <Link to="/criar-refeicao" className="btn btn-primary">
              <span>+</span> Nova refeição
            </Link>
          </div>

          {erro && (
            <div className="alert alert-error">{erro}</div>
          )}

          {!carregando && !erro && refeicoes.length === 0 && (
            <div className="empty-state sem-refeicoes">
              <span className="empty-state-icon">🍽️</span>
              <h3>Nenhuma refeição cadastrada</h3>
              <p className="text-muted">
                O cardápio ainda está vazio. Cadastre a primeira refeição.
              </p>
              <Link to="/criar-refeicao" className="btn btn-outline">
                Cadastrar primeira refeição
              </Link>
            </div>
          )}

          {!carregando && !erro && refeicoes.length > 0 && (
            <div className="lista-refeicoes">
              {refeicoes.map((refeicao) => (
                <div className="card-refeicao card" key={refeicao.id_refeicao}>
                  <div className="informacoes-refeicao">
                    <h2>{refeicao.nomeRefeicao || refeicao.nomerefeicao || "Sem nome"}</h2>
                    <p className="descricao text-muted">
                      {refeicao.descricao}
                    </p>
                    <span className="badge">
                      {refeicao.categoria}
                    </span>
                  </div>
                  <div className="acoes flex gap-2">
                    <Link
                      to={`/gerenciarRefeicao/${refeicao.id_refeicao}`}
                      className="btn btn-outline btn-sm"
                    >
                      Editar
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => excluirRefeicao(refeicao.id_refeicao)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        Cardápio Digital Escolar © 2026
      </footer>
    </div>
  );
}

export default ListaRefeicoes;
