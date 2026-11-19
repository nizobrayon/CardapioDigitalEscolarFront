import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login/Login.css";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("aluno");
  const [raAluno, setRaAluno] = useState("");
  const [crnNutricionista, setCrnNutricionista] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrarUsuario(event) {
    event.preventDefault();
    setMensagem("");

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não são iguais!");
      return;
    }

    if (senha.length < 6) {
      setMensagem("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (tipoUsuario === "aluno" && !raAluno.trim()) {
      setMensagem("Informe o RA do aluno.");
      return;
    }

    if (
      tipoUsuario === "nutricionista" &&
      !crnNutricionista.trim()
    ) {
      setMensagem("Informe o CRN do nutricionista.");
      return;
    }

    const dadosUsuario = {
      nomeUsuario: nome.trim(),
      emailUsuario: email.trim(),
      senha: senha,
      tipoUsuario: tipoUsuario,
    };

    if (tipoUsuario === "aluno") {
      dadosUsuario.raAluno = raAluno.trim();
    }

    if (tipoUsuario === "nutricionista") {
      dadosUsuario.crnNutricionista = crnNutricionista.trim();
    }

    try {
      setCarregando(true);

      const resposta = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosUsuario),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "Não foi possível cadastrar."
        );
      }

      setMensagem(
        dados.mensagem || "Usuário cadastrado com sucesso!"
      );

      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setRaAluno("");
      setCrnNutricionista("");
      setTipoUsuario("aluno");
    } catch (erro) {
      setMensagem(
        erro.message === "Failed to fetch"
          ? "Não foi possível conectar ao servidor. Verifique se a API está ligada."
          : erro.message
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="page cadastro-page">
      <header className="app-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🍽️</span>
          Cardápio Digital Escolar
        </Link>
        <nav className="app-nav">
          <Link to="/loginaluno">Voltar ao login</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="card login-card max-w-md mx-auto">
            <div className="text-center mb-6">
              <h1 className="mb-2">Criar conta</h1>
              <p className="text-muted">Junte-se ao Cardápio Digital Escolar</p>
            </div>

            {mensagem && (
              <div className={`alert ${mensagem.includes("sucesso") ? "alert-success" : "alert-error"}`}>
                {mensagem}
              </div>
            )}

            <form onSubmit={cadastrarUsuario} className="form">
              <div className="form-group">
                <label htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  type="text"
                  className="form-control"
                  placeholder="Digite seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirme sua senha</label>
                <input
                  id="confirmarSenha"
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tipoUsuario">Tipo de usuário</label>
                <select
                  id="tipoUsuario"
                  className="form-control"
                  value={tipoUsuario}
                  onChange={(e) => setTipoUsuario(e.target.value)}
                >
                  <option value="aluno">Aluno</option>
                  <option value="nutricionista">Nutricionista</option>
                </select>
              </div>

              {tipoUsuario === "aluno" && (
                <div className="form-group">
                  <label htmlFor="raAluno">RA do aluno</label>
                  <input
                    id="raAluno"
                    type="text"
                    inputMode="numeric"
                    className="form-control"
                    placeholder="Digite seu RA"
                    value={raAluno}
                    onChange={(e) => setRaAluno(e.target.value)}
                    required
                  />
                </div>
              )}

              {tipoUsuario === "nutricionista" && (
                <div className="form-group">
                  <label htmlFor="crnNutricionista">CRN</label>
                  <input
                    id="crnNutricionista"
                    type="text"
                    inputMode="numeric"
                    className="form-control"
                    placeholder="Digite seu CRN"
                    value={crnNutricionista}
                    onChange={(e) => setCrnNutricionista(e.target.value)}
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full mt-4" disabled={carregando}>
                {carregando ? "Cadastrando..." : "Cadastrar conta"}
              </button>
            </form>

            <p className="cadastro-text text-center mt-6">
              Já possui uma conta?{" "}
              <Link to="/loginaluno">Faça login</Link>
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

export default Cadastro;
