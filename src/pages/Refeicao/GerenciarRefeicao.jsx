import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./GerenciarRefeicao.css";

function GerenciarRefeicao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nomeRefeicao, setNomeRefeicao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const buscarRefeicao = async () => {
      try {
        const resposta = await fetch(
          `http://localhost:3000/refeicoes/${id}`
        );

        if (!resposta.ok) {
          throw new Error("Erro ao buscar refeição");
        }

        const dados = await resposta.json();

        setNomeRefeicao(
          dados.nomeRefeicao || dados.nomerefeicao || ""
        );
        setDescricao(dados.descricao || "");
        setCategoria(dados.categoria || "");
      } catch {
        setMensagem("Erro ao carregar refeição.");
      } finally {
        setCarregando(false);
      }
    };

    buscarRefeicao();
  }, [id]);

  async function salvarAlteracoes(e) {
    e.preventDefault();

    try {
      const resposta = await fetch(
        `http://localhost:3000/refeicoes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nomeRefeicao,
            descricao,
            categoria,
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao atualizar");
      }

      setMensagem("Refeição atualizada com sucesso!");
    } catch {
      setMensagem("Erro ao atualizar refeição.");
    }
  }

  async function excluirRefeicao() {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta refeição? Essa ação não poderá ser desfeita."
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

      window.alert("Refeição excluída com sucesso!");
      navigate("/cardapio", { replace: true });
    } catch {
      setMensagem("Erro ao excluir refeição.");
    }
  }

  if (carregando) {
    return (
      <div className="page gerenciar-refeicao-page">
        <header className="app-header">
          <Link to="/" className="logo">
            <span className="logo-icon">🍽️</span>
            Cardápio Digital Escolar
          </Link>
          <nav className="app-nav">
            <Link to="/cardapio">Cardápio</Link>
            <Link to="/gerenciar-refeicoes">Gerenciar refeições</Link>
            <Link to="/avaliacoes-alunos">Avaliações</Link>
            <Link to="/sugestoes-alunos">Sugestões</Link>
            <Link to="/perfil">Perfil</Link>
          </nav>
        </header>
        <main className="main-content">
          <div className="container">
            <div className="card text-center py-10">
              <p className="text-muted">Carregando refeição...</p>
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
    <div className="page gerenciar-refeicao-page">
      <header className="app-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🍽️</span>
          Cardápio Digital Escolar
        </Link>
        <nav className="app-nav">
          <Link to="/cardapio">Cardápio</Link>
          <Link to="/gerenciar-refeicoes">Gerenciar refeições</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="card max-w-md mx-auto">
            <div className="text-center mb-6">
              <h1 className="mb-2">Gerenciar refeição</h1>
              <p className="text-muted">Edite as informações da refeição.</p>
            </div>

            {mensagem && (
              <div className={`alert ${mensagem.includes("sucesso") ? "alert-success" : "alert-error"}`}>
                {mensagem}
              </div>
            )}

            <form onSubmit={salvarAlteracoes} className="form">
              <div className="form-group">
                <label>Nome da refeição</label>
                <input
                  type="text"
                  className="form-control"
                  value={nomeRefeicao}
                  onChange={(e) => setNomeRefeicao(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  className="form-control"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoria</label>
                <input
                  type="text"
                  className="form-control"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                />
              </div>

              <div className="botoes flex gap-2 mt-6">
                <button
                  type="button"
                  className="btn btn-secondary btn-full cancelar"
                  onClick={() => navigate("/cardapio")}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-full excluir"
                  onClick={excluirRefeicao}
                >
                  Excluir refeição
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-full salvar"
                >
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        Cardápio Digital Escolar 2026
      </footer>
    </div>
  );
}

export default GerenciarRefeicao;
