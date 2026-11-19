import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import "./CriarRefeicao.css";

function CriarRefeicao() {
  const [nomeRefeicao, setNomeRefeicao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [diaSemana, setDiaSemana] = useState("");

  const navigate = useNavigate();

  async function handleCriarRefeicao(event) {
    event.preventDefault();

    try {
      await api.post("/refeicoes", {
        nomeRefeicao,
        descricao,
        categoria,
        diaSemana,
      });

      navigate("/cardapio");
    } catch (error) {
      console.error(error);
      alert("Não foi possível cadastrar a refeição.");
    }
  }

  return (
    <div className="page criar-refeicao-page">
      <header className="app-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🍽️</span>
          Cardápio Digital Escolar
        </Link>
        <nav className="app-nav">
          <Link to="/cardapio">Cardápio</Link>
          <Link to="/avaliacoes-alunos">Avaliações</Link>
          <Link to="/sugestoes-alunos">Sugestões</Link>
          <Link to="/perfil">Perfil</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="card max-w-lg mx-auto">
            <div className="text-center mb-6">
              <h1 className="mb-2">Cadastrar Refeição</h1>
              <p className="text-muted">Adicione uma nova refeição ao cardápio.</p>
            </div>

            <form onSubmit={handleCriarRefeicao} className="form">
              <div className="form-group">
                <label htmlFor="nomeRefeicao">Nome da refeição</label>
                <input
                  id="nomeRefeicao"
                  type="text"
                  className="form-control"
                  placeholder="Ex.: Arroz, feijão e frango grelhado"
                  value={nomeRefeicao}
                  onChange={(e) => setNomeRefeicao(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  className="form-control"
                  placeholder="Descreva os ingredientes e modo de preparo..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="categoria">Categoria</label>
                  <select
                    id="categoria"
                    className="form-control"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Café da Manhã">Café da Manhã</option>
                    <option value="Almoço">Almoço</option>
                    <option value="Café da Tarde">Café da Tarde</option>
                    <option value="Janta">Janta</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="diaSemana">Dia da semana</label>
                  <select
                    id="diaSemana"
                    className="form-control"
                    value={diaSemana}
                    onChange={(e) => setDiaSemana(e.target.value)}
                    required
                  >
                    <option value="">Selecione um dia</option>
                    <option value="Segunda-feira">Segunda-feira</option>
                    <option value="Terça-feira">Terça-feira</option>
                    <option value="Quarta-feira">Quarta-feira</option>
                    <option value="Quinta-feira">Quinta-feira</option>
                    <option value="Sexta-feira">Sexta-feira</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full mt-2">
                Cadastrar refeição
              </button>
            </form>

            <Link to="/cardapio" className="btn btn-outline btn-full mt-4">
              Voltar para o cardápio
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

export default CriarRefeicao;
