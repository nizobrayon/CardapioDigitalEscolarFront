
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
        nomeRefeicao: nomeRefeicao,
        descricao: descricao,
        categoria: categoria,
        diaSemana: diaSemana,
      });

      alert("Refeição cadastrada com sucesso!");
      navigate("/cardapio");
    } catch (error) {
      console.error(error);
      alert("Não foi possível cadastrar a refeição.");
    }
  }

  return (
    <div className="criar-refeicao">
      <h1>Cadastrar Refeição</h1>

      <form onSubmit={handleCriarRefeicao}>
        <label htmlFor="nomeRefeicao">Nome da refeição</label>
        <input
          id="nomeRefeicao"
          type="text"
          value={nomeRefeicao}
          onChange={(e) => setNomeRefeicao(e.target.value)}
          required
        />

        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <label htmlFor="categoria">Categoria</label>
        <select
          id="categoria"
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

        <label htmlFor="diaSemana">Dia da semana</label>
        <select
          id="diaSemana"
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

        <button type="submit">Cadastrar refeição</button>

        <Link to="/cardapio">Voltar para o cardápio</Link>
      </form>
    </div>
  );
}

export default CriarRefeicao;
