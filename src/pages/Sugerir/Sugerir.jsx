import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUsuarioLogado, getIdUsuario, getTipoUsuario } from "../../services/auth";
import "./Sugerir.css";

function Sugerir() {
  const location = useLocation();
  const usuarioDoState = location.state?.usuario;
  const usuarioLogado = getUsuarioLogado();
  const usuario = usuarioDoState || usuarioLogado;
  const tipoUsuario = usuario?.tipoUsuario || getTipoUsuario() || null;
  const [nomePrato, setNomePrato] = useState("");
  const [descricao, setDescricao] = useState("");
  const [minhasSugestoes, setMinhasSugestoes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [excluindoId, setExcluindoId] = useState(null);

  const idUsuario = getIdUsuario(usuario);

  useEffect(() => {
    let cancelado = false;

    const carregar = async () => {
      if (!idUsuario) {
        setCarregandoLista(false);
        return;
      }
      try {
        const resposta = await fetch("http://localhost:3000/sugestoes");
        const dados = await resposta.json();
        if (cancelado) return;
        const lista = Array.isArray(dados) ? dados : [];
        const minhas = lista.filter(
          (s) =>
            s.nomeusuario === usuario?.nomeusuario &&
            s.raaluno === usuario?.raaluno
        );
        setMinhasSugestoes(minhas);
      } catch {
        if (cancelado) return;
        setMinhasSugestoes([]);
      } finally {
        if (!cancelado) setCarregandoLista(false);
      }
    };

    carregar();

    return () => {
      cancelado = true;
    };
  }, [idUsuario, usuario]);

  async function handleEnviar(event) {
    event.preventDefault();
    setMensagem("");

    const idUsuarioAtual = usuario?.idusuario || usuario?.idUsuario;
    if (!idUsuarioAtual) {
      setMensagem("Faça login como aluno para enviar sugestão.");
      return;
    }

    try {
      setCarregando(true);
      const resposta = await fetch("http://localhost:3000/sugestoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUsuario: idUsuarioAtual,
          nomePrato,
          descricao,
        }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.mensagem || "Erro ao enviar.");
      setMensagem(dados.mensagem || "Sugestão enviada com sucesso!");
      setNomePrato("");
      setDescricao("");

      setMinhasSugestoes([
        ...minhasSugestoes,
        {
          nomecomidasugestao: nomePrato,
          descricaosugestao: descricao,
          statussugestao: "Pendente",
          nomeusuario: usuario?.nomeusuario,
          raaluno: usuario?.raaluno,
        },
      ]);
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

  async function excluirSugestao(id) {
    if (
      !window.confirm("Tem certeza que deseja excluir esta sugestão?")
    ) {
      return;
    }
    if (!idUsuario) return;

    try {
      setExcluindoId(id);
      const resposta = await fetch(
        `http://localhost:3000/sugestoes/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idUsuario }),
        }
      );
      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao excluir.");
      }
      setMensagem(dados.mensagem || "Sugestão excluída com sucesso!");
      setMinhasSugestoes(
        minhasSugestoes.filter((s) => s.idsugestao !== id)
      );
    } catch (erro) {
      setMensagem(erro.message || "Não foi possível excluir a sugestão.");
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <div className="page sugerir-page">
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
              <Link to="/perfil">Perfil</Link>
            </>
          ) : (
            <>
              <Link to="/home">Início</Link>
              <Link to="/cardapio">Cardápio</Link>
              <Link to="/sugerir" className="ativo">Sugerir</Link>
              <Link to="/perfil">Perfil</Link>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="grid grid-cols-2 gap-6">
            <div className="card form-card">
              <div className="text-center mb-6">
                <h1 className="mb-2">Sugerir Refeição</h1>
                <p className="text-muted">
                  Tem uma ideia de prato para o cardápio escolar?
                  Compartilhe sua sugestão conosco!
                </p>
              </div>

              {mensagem && (
                <div className={`alert ${mensagem.includes("sucesso") ? "alert-success" : "alert-error"} mb-6`}>
                  {mensagem}
                </div>
              )}

              <form onSubmit={handleEnviar} className="form">
                <div className="form-group">
                  <label htmlFor="nomePrato">Nome do prato sugerido</label>
                  <input
                    type="text"
                    id="nomePrato"
                    className="form-control"
                    value={nomePrato}
                    onChange={(event) => setNomePrato(event.target.value)}
                    placeholder="Ex.: Macarrão à bolonhesa"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="descricao">Descrição breve do prato</label>
                  <textarea
                    id="descricao"
                    className="form-control"
                    value={descricao}
                    onChange={(event) => setDescricao(event.target.value)}
                    placeholder="Conte quais ingredientes o prato teria..."
                    rows="4"
                    maxLength={300}
                    required
                  />
                  <span className="form-text">
                    {descricao.length}/300 caracteres
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={carregando}
                >
                  {carregando ? "Enviando..." : "Enviar Sugestão"}
                </button>
              </form>

              <Link to="/cardapio" className="btn btn-outline btn-full mt-4">
                Voltar para o cardápio
              </Link>
            </div>

            <div className="card minhas-sugestoes-card">
              <div className="text-center mb-6">
                <h2 className="mb-2">Minhas sugestões</h2>
              </div>

              {carregandoLista && (
                <p className="text-muted text-center">Carregando...</p>
              )}

              {!carregandoLista && minhasSugestoes.length === 0 && (
                <div className="empty-state">
                  <span className="empty-state-icon">📭</span>
                  <h3>Nenhuma sugestão ainda</h3>
                  <p className="text-muted">
                    Envie uma sugestão para vê-la aqui.
                  </p>
                </div>
              )}

              {!carregandoLista && minhasSugestoes.length > 0 && (
                <div className="lista-minhas-sugestoes">
                  {minhasSugestoes.map((sug) => (
                    <div
                      className="card card-minha-sugestao"
                      key={sug.idsugestao || sug.nomecomidasugestao}
                    >
                      <div className="sugestao-info">
                        <span className="badge">
                          {sug.statussugestao || "Pendente"}
                        </span>
                        <h4>{sug.nomecomidasugestao}</h4>
                        <p className="text-muted text-sm mt-2">
                          {sug.descricaosugestao}
                        </p>
                        <p className="text-xs text-muted mt-2">
                          {sug.datasugestao
                            ? new Date(sug.datasugestao).toLocaleDateString(
                                "pt-BR"
                              )
                            : ""}
                        </p>
                      </div>
                      <button
                        className="btn btn-outline btn-sm excluir-btn"
                        onClick={() => excluirSugestao(sug.idsugestao)}
                        disabled={excluindoId === sug.idsugestao}
                      >
                        {excluindoId === sug.idsugestao
                          ? "Excluindo..."
                          : "Excluir"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        Cardápio Digital Escolar © 2026
      </footer>
    </div>
  );
}

export default Sugerir;
