import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginAluno from "./pages/Login/LoginAluno";
import Cadastro from "./pages/Cadastro";
import LoginNutri from "./pages/Login/LoginNutri";
import Home from "./pages/Home/Home";
import Cardapio from "./pages/Cardapio/Cardapio";
import CriarRefeicao from "./pages/Refeicao/CriarRefeicao";
import GerenciarRefeicoes from "./pages/Refeicao/GerenciarRefeicao";
import Perfil from "./pages/Perfil/Perfil";
import Avaliar from "./pages/Avaliar/Avaliar";
import Sugerir from "./pages/Sugerir/Sugerir";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/gerenciarRefeicao/:id" element={<GerenciarRefeicoes />} />
        <Route path="/criar-refeicao" element={<CriarRefeicao />} />
        <Route path="/loginAluno" element={<LoginAluno />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/loginNutri" element={<LoginNutri />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cardapio" element={<Cardapio />} />
        <Route path="/avaliar" element={<Avaliar />} />
        <Route path="/sugerir" element={<Sugerir/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;