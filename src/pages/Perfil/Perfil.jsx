import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  clearUsuarioLogado,
  getIdUsuario,
  getUsuarioLogado,
  setUsuarioLogado,
} from "../../services/auth";
import "./Perfil.css";

function Perfil() {
  const navigate = useNavigate();

  const [usuarioLogin, setUsuarioLogin] = useState(() => getUsuarioLogado());
  const tipoUsuario = usuarioLogin?.tipoUsuario || null;
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [ra, setRa] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    (async () => {
      const idUsuario = getIdUsuario(getUsuarioLogado());
      if (!idUsuario) {
        setMensagem("Não foi possível identificar sua conta. Faça login novamente.");
        setCarregando(false);
        return;
      }

      try {
        const resposta = await fetch(`http://localhost:3000/usuarios/${idUsuario}`);
        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(dados.mensagem || "Erro ao buscar perfil.");
        }

        setNome(dados.usuario.nomeusuario || "");
        setEmail(dados.usuario.emailusuario || "");
        setRa(dados.usuario.raaluno || "");
        const novo = { ...(getUsuarioLogado() || {}), ...dados.usuario };
        setUsuarioLogin(novo);
        setUsuarioLogado(novo);
      } catch {
        setMensagem("Não foi possível conectar ao servidor.");
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  async function salvarAlteracoes(event) {
    event.preventDefault();
    setMensagem("");

    const idUsuario = getIdUsuario(getUsuarioLogado());
    if (!idUsuario) {
      setMensagem("Faça login novamente para alterar seus dados.");
      return;
    }

    try {
      const resposta = await fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeUsuario: nome,
          emailUsuario: email,
          raAluno: ra,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao atualizar perfil.");
      }

      setNome(dados.usuario.nomeusuario || "");
      setEmail(dados.usuario.emailusuario || "");
      setRa(dados.usuario.raaluno || "");
      const novo = { ...(getUsuarioLogado() || {}), ...dados.usuario };
      setUsuarioLogin(novo);
      setUsuarioLogado(novo);
      setMensagem("Dados atualizados com sucesso!");
      setEditando(false);
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    }
  }

  async function excluirConta() {
    const confirmar = window.confirm(
      "Tem certeza de que deseja excluir sua conta? Essa ação não poderá ser desfeita."
    );

    if (!confirmar) return;

    const idUsuario = getIdUsuario(getUsuarioLogado());
    if (!idUsuario) {
      setMensagem("Não foi possível identificar sua conta. Faça login novamente.");
      return;
    }

    try {
      const resposta = await fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
        method: "DELETE",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao excluir conta.");
      }

      clearUsuarioLogado();
      window.alert("Conta excluída com sucesso!");
      navigate("/loginAluno", { replace: true });
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    }
  }

  if (carregando) {
    return (
      <div className="page perfil-page">
        <header className="app-header">
          <Link to="/" className="logo">
            <span className="logo-icon">🍽️</span>
            Cardápio Digital Escolar
          </Link>
          <nav className="app-nav">
            <Link to="/home">Início</Link>
          </nav>
        </header>
        <main className="main-content">
          <div className="container">
            <div className="card text-center py-10">
              <p className="text-muted">Carregando perfil...</p>
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
    <div className="page perfil-page">
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
            </>
          ) : (
            <>
              <Link to="/home">Início</Link>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="card max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="perfil-avatar">👤</div>
              <h1 className="mb-1">Meu Perfil</h1>
              <p className="text-muted">Consulte e altere seus dados pessoais.</p>
            </div>

            {mensagem && (
              <div className={`alert ${mensagem.includes("sucesso") ? "alert-success" : "alert-error"}`}>
                {mensagem}
              </div>
            )}

            <form onSubmit={salvarAlteracoes} className="form">
              <div className="form-group">
                <label htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  type="text"
                  className="form-control"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={!editando}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editando}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ra">RA do aluno</label>
                <input
                  id="ra"
                  type="text"
                  className="form-control"
                  value={ra}
                  onChange={(e) => setRa(e.target.value)}
                  disabled={!editando}
                  required
                />
              </div>

              {!editando ? (
                <button
                  type="button"
                  className="btn btn-outline btn-full"
                  onClick={() => {
                    setMensagem("");
                    setEditando(true);
                  }}
                >
                  Editar dados
                </button>
              ) : (
                <>
                  <button type="submit" className="btn btn-primary btn-full">
                    Salvar alterações
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-full mt-3"
                    onClick={() => {
                      setNome(usuarioLogin?.nomeusuario || nome);
                      setEmail(usuarioLogin?.emailusuario || email);
                      setRa(usuarioLogin?.raaluno || ra);
                      setMensagem("");
                      setEditando(false);
                    }}
                  >
                    Cancelar
                  </button>
                </>
              )}
            </form>

            <div className="perfil-excluir mt-8 pt-6 border-t">
              <h3 className="text-danger">Excluir minha conta</h3>
              <p className="text-muted text-sm">
                Essa ação não poderá ser desfeita.
              </p>
              <button
                type="button"
                className="btn btn-danger btn-full mt-3"
                onClick={excluirConta}
              >
                Excluir conta
              </button>
            </div>

            <Link to="/home" className="btn btn-outline btn-full mt-6">
              Voltar para o início
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

export default Perfil;
