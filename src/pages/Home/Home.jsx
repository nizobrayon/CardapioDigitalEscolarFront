
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Home.css";

function Home() {
  const location = useLocation();
  const usuario = location.state?.usuario;

  const nomeUsuario = usuario?.nomeusuario || "Meu perfil";

  const [refeicao, setRefeicao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarRefeicao() {
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
          // Exibe a refeição com o maior ID.
          const maisRecente = [...lista].sort(
            (a, b) =>
              Number(b.id_refeicao) - Number(a.id_refeicao)
          )[0];

          setRefeicao(maisRecente);
        } else {
          setRefeicao(null);
        }
      } catch (error) {
        setErro("Não foi possível carregar a refeição. Verifique o servidor.");
      } finally {
        setCarregando(false);
      }
    }

    buscarRefeicao();
  }, []);

  return (
    <div className="home">
      {/* CABEÇALHO */}
      <header className="header">
        <div className="logo">
          <span>Cantina Digital Escolar</span>
        </div>

        <nav className="menu">
          <Link to="/home">Início</Link>
          <Link to="/cardapio">Cardápio</Link>
          <Link to="/avaliar">Avaliar</Link>
          <Link to="/sugerir">Sugerir</Link>
        </nav>

        {/* PERFIL DO USUÁRIO */}
        <Link to="/perfil" className="perfil">
          <div className="perfil-icone">👤</div>

          <div className="perfil-info">
            <span className="perfil-nome">{nomeUsuario}</span>
            <span className="perfil-texto">Meu perfil</span>
          </div>
        </Link>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="main-content">
        <section className="home-boas-vindas">
          <p className="home-subtitulo">
            CANTINA DIGITAL ESCOLAR
          </p>

          <h1>Olá, {nomeUsuario}!</h1>

          <p>
            Confira a refeição em destaque e conheça nosso cardápio.
          </p>
        </section>

        <section className="home-cardapio">
          <div className="home-titulo-secao">
            <div>
              <h2>🍽️ Refeição em destaque</h2>
              <p>Confira o que foi cadastrado na cantina.</p>
            </div>

            <Link to="/cardapio" className="home-ver-cardapio">
              Ver cardápio completo
            </Link>
          </div>

          {carregando && (
            <p className="home-mensagem">
              Carregando refeição...
            </p>
          )}

          {erro && (
            <p className="home-erro">{erro}</p>
          )}

          {!carregando && !erro && !refeicao && (
            <div className="home-sem-refeicao">
              <span>🥗</span>
              <h3>Nenhuma refeição cadastrada</h3>
              <p>
                Quando uma refeição for cadastrada, ela aparecerá aqui.
              </p>

              <Link to="/cardapio">
                Acessar cardápio
              </Link>
            </div>
          )}

          {!carregando && !erro && refeicao && (
            <article className="home-refeicao-card">
              <div className="home-refeicao-icone">
                🍛
              </div>

              <div className="home-refeicao-info">
                <span className="home-refeicao-categoria">
                  {refeicao.categoria || refeicao.categoriarefeicao || "Refeição"}
                </span>

                <h3>
                  {refeicao.nomeRefeicao || refeicao.nomerefeicao}
                </h3>

                <p>
                  {refeicao.descricao || "Sem descrição cadastrada."}
                </p>

                <Link
                  to="/cardapio"
                  className="home-botao-detalhes"
                >
                  Conhecer o cardápio
                </Link>
              </div>
            </article>
          )}
        </section>

        <section className="home-acoes">
          <Link to="/avaliar" className="home-acao">
            <span>⭐</span>
            <h3>Avaliar refeições</h3>
            <p>Dê sua opinião sobre as refeições.</p>
          </Link>

          <Link to="/sugerir" className="home-acao">
            <span>💡</span>
            <h3>Sugerir refeições</h3>
            <p>Compartilhe suas ideias para o cardápio.</p>
          </Link>
        </section>
      </main>

      {/* RODAPÉ */}
      <footer className="footer">
        <p>Cardápio Digital Escolar © 2026</p>
      </footer>
    </div>
  );
}

export default Home;
