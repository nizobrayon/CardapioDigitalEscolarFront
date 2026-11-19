import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUsuarioLogado, getTipoUsuario } from "../../services/auth";
import "./Home.css";

function Home() {
  const location = useLocation();
  const usuarioDoState = location.state?.usuario;
  const usuarioLogado = getUsuarioLogado();
  const usuario = usuarioDoState || usuarioLogado;

  const nomeUsuario = usuario?.nomeusuario || "Meu perfil";
  const tipoUsuario = usuario?.tipoUsuario || getTipoUsuario() || null;

  const [refeicao, setRefeicao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const resposta = await fetch(
          "http://localhost:3000/refeicoes"
        );

        if (!resposta.ok) {
          throw new Error("Não foi possível buscar as refeições.");
        }

        const dados = await resposta.json();

        const lista = Array.isArray(dados)
          ? dados
          : dados.refeicoes || [];

        if (lista.length > 0) {
          const maisRecente = [...lista].sort(
            (a, b) =>
              Number(b.id_refeicao) - Number(a.id_refeicao)
          )[0];

          setRefeicao(maisRecente);
        } else {
          setRefeicao(null);
        }
      } catch {
        setErro("Não foi possível carregar a refeição. Verifique o servidor.");
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  return (
    <div className="page home-page">
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
              <Link to="/home" className="ativo">Início</Link>
              <Link to="/cardapio">Cardápio</Link>
              <Link to="/avaliar">Avaliar</Link>
              <Link to="/sugerir">Sugerir</Link>
              <Link to="/perfil">Perfil</Link>
            </>
          )}
        </nav>
        <Link to="/perfil" className="perfil-link">
          <span className="perfil-icone">👤</span>
          <span className="perfil-nome">{nomeUsuario}</span>
        </Link>
      </header>

      <main className="main-content">
        <div className="container">
          <section className="home-boas-vindas">
            <p className="home-subtitulo">CANTINA DIGITAL ESCOLAR</p>
            <h1>Olá, {nomeUsuario}!</h1>
            <p>
              Confira a refeição em destaque e conheça nosso cardápio.
            </p>
          </section>

          <section className="home-cardapio card">
            <div className="home-titulo-secao flex items-center justify-between gap-2">
              <div>
                <h2>🍽️ Refeição em destaque</h2>
                <p className="text-muted">Confira o que foi cadastrado na cantina.</p>
              </div>
              <Link to="/cardapio" className="btn btn-outline btn-sm">
                Ver cardápio completo
              </Link>
            </div>

            {carregando && (
              <p className="home-mensagem text-center">Carregando refeição...</p>
            )}

            {erro && (
              <div className="alert alert-error text-center">{erro}</div>
            )}

            {!carregando && !erro && !refeicao && (
              <div className="empty-state home-sem-refeicao">
                <span className="empty-state-icon">🥗</span>
                <h3>Nenhuma refeição cadastrada</h3>
                <p className="text-muted">
                  Quando uma refeição for cadastrada, ela aparecerá aqui.
                </p>
                <Link to="/cardapio" className="btn btn-outline">
                  Acessar cardápio
                </Link>
              </div>
            )}

            {!carregando && !erro && refeicao && (
              <article className="home-refeicao-card card">
                <div className="home-refeicao-icone">🍛</div>
                <div className="home-refeicao-info">
                  <span className="badge">
                    {refeicao.categoria || refeicao.categoriarefeicao || "Refeição"}
                  </span>
                  <h3>
                    {refeicao.nomeRefeicao || refeicao.nomerefeicao}
                  </h3>
                  <p className="text-muted">
                    {refeicao.descricao || "Sem descrição cadastrada."}
                  </p>
                  <Link
                    to="/cardapio"
                    className="btn btn-primary btn-sm mt-2"
                  >
                    Conhecer o cardápio
                  </Link>
                </div>
              </article>
            )}
          </section>

          <section className="home-acoes grid grid-cols-2 gap-4">
            <Link to="/avaliar" className="home-acao card flex flex-col items-center text-center p-6">
              <span className="text-4xl mb-3">⭐</span>
              <h3>Avaliar refeições</h3>
              <p className="text-muted">Dê sua opinião sobre as refeições.</p>
            </Link>

            <Link to="/sugerir" className="home-acao card flex flex-col items-center text-center p-6">
              <span className="text-4xl mb-3">💡</span>
              <h3>Sugerir refeições</h3>
              <p className="text-muted">Compartilhe suas ideias para o cardápio.</p>
            </Link>
          </section>
        </div>
      </main>

      <footer className="app-footer">
        Cardápio Digital Escolar © 2026
      </footer>
    </div>
  );
}

export default Home;
