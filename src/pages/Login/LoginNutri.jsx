import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setUsuarioLogado } from "../../services/auth";
import "./Login.css";

function LoginNutri() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  async function fazerLogin(event) {
    event.preventDefault();
    setMensagem("");

    if (!email.trim() || !senha) {
      setMensagem("Preencha o e-mail e a senha.");
      return;
    }

    try {
      setCarregando(true);
      const resposta = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailUsuario: email.trim(),
          senha,
        }),
      });

      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Não foi possível entrar.");
      }

      setUsuarioLogado(dados.usuario);
      navigate("/criar-refeicao");
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
    <div className="page login-page">
      <header className="app-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🍽️</span>
          Cardápio Digital Escolar
        </Link>
        <nav className="app-nav">
          <Link to="/loginAluno">Aluno</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="card login-card max-w-md mx-auto">
            <div className="text-center mb-6">
              <h1 className="mb-2">Bem-vindo de volta</h1>
              <p className="text-muted">Entre na sua conta de nutricionista</p>
            </div>

            {mensagem && (
              <div className="alert alert-error">{mensagem}</div>
            )}

            <form onSubmit={fazerLogin} className="form">
              <div className="form-group">
                <label htmlFor="emailNutri">E-mail</label>
                <input
                  id="emailNutri"
                  type="email"
                  className="form-control"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="senhaNutri">Senha</label>
                <input
                  id="senhaNutri"
                  type="password"
                  className="form-control"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="btn-group mt-4">
                <Link to="/loginAluno">
                  <button type="button" className="btn btn-secondary">Aluno</button>
                </Link>
                <Link to="/loginNutri">
                  <button type="button" className="btn btn-secondary">Nutricionista</button>
                </Link>
              </div>

              <button type="submit" className="btn btn-primary btn-full mt-4" disabled={carregando}>
                {carregando ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="cadastro-text text-center mt-6">
              Ainda não possui uma conta?{" "}
              <Link to="/cadastro">Cadastre-se</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        Cardápio Digital Escolar © 2026
      </footer>
    </div>
  );
}

export default LoginNutri;
