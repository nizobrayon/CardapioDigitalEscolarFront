import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setUsuarioLogado } from "../../services/auth";
import "./Login.css";

function LoginAluno() {
  const [email, setEmail] = useState("");
  const [raAluno, setRaAluno] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  async function fazerLogin(event) {
    event.preventDefault();
    setMensagem("");

    if (!email.trim() || !raAluno.trim() || !senha) {
      setMensagem("Preencha o e-mail, o RA e a senha.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch(
        "http://localhost:3000/usuarios/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailUsuario: email.trim(),
            raAluno: raAluno.trim(),
            senha,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "NÃ£o foi possÃ­vel entrar."
        );
      }
      setUsuarioLogado(dados.usuario);
      navigate("/home");
    } catch (erro) {
      setMensagem(
        erro.message === "Failed to fetch"
          ? "NÃ£o foi possÃ­vel conectar ao servidor."
          : erro.message
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="loginContainer">
      <div className="login-box">
        <h1>CardÃ¡pio Digital Escolar</h1>

        <p className="login-subtitle">
          Entre na sua conta
        </p>

        <p className="login-subtitle2">ALUNO</p>

        <form onSubmit={fazerLogin}>
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="raAluno">RA do Aluno</label>
            <input
              id="raAluno"
              type="text"
              inputMode="numeric"
              placeholder="Digite seu RA"
              value={raAluno}
              onChange={(e) => setRaAluno(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {mensagem && (
            <p className="mensagem-cadastro" role="alert">
              {mensagem}
            </p>
          )}

          <div className="container">
            <Link to="/loginaluno">
              <button type="button">Aluno</button>
            </Link>

            <Link to="/loginNutri">
              <button type="button">Nutricionista</button>
            </Link>
          </div>

          <button type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="cadastro-text">
          Ainda nÃ£o possui uma conta?{" "}
          <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginAluno;

