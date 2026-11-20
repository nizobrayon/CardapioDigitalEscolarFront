import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginAluno from "./pages/Login/LoginAluno";
import LoginNutri from "./pages/Login/LoginNutri";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home/Home";
import Cardapio from "./pages/Cardapio/Cardapio";
import CriarRefeicao from "./pages/Refeicao/CriarRefeicao";
import GerenciarRefeicoes from "./pages/Refeicao/GerenciarRefeicao";
import ListaRefeicoes from "./pages/Refeicao/ListaRefeicoes";
import Perfil from "./pages/Perfil/Perfil";
import Avaliar from "./pages/Avaliar/Avaliar";
import Sugerir from "./pages/Sugerir/Sugerir";
import AvaliacoesAlunos from "./pages/Nutricionista/AvaliacoesAlunos";
import SugestoesAlunos from "./pages/Nutricionista/SugestoesAlunos";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated, getTipoUsuario } from "./services/auth";

function RedirecionarInicio() {
  if (!isAuthenticated()) {
    return <Navigate to="/loginAluno" replace />;
  }
  return getTipoUsuario() === "nutricionista"
    ? <Navigate to="/criar-refeicao" replace />
    : <Navigate to="/home" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/loginAluno" element={<LoginAluno />} />
        <Route path="/loginNutri" element={<LoginNutri />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas protegidas - Aluno */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["aluno"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cardapio"
          element={
            <ProtectedRoute allowedRoles={["aluno"]}>
              <Cardapio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/avaliar"
          element={
            <ProtectedRoute allowedRoles={["aluno"]}>
              <Avaliar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sugerir"
          element={
            <ProtectedRoute allowedRoles={["aluno"]}>
              <Sugerir />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute allowedRoles={["aluno", "nutricionista"]}>
              <Perfil />
            </ProtectedRoute>
          }
        />

        {/* Rotas protegidas - Nutricionista */}
        <Route
          path="/criar-refeicao"
          element={
            <ProtectedRoute allowedRoles={["nutricionista"]}>
              <CriarRefeicao />
            </ProtectedRoute>
          }
        />
        <Route
          path="/avaliacoes-alunos"
          element={
            <ProtectedRoute allowedRoles={["nutricionista"]}>
              <AvaliacoesAlunos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sugestoes-alunos"
          element={
            <ProtectedRoute allowedRoles={["nutricionista"]}>
              <SugestoesAlunos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gerenciarRefeicao/:id"
          element={
            <ProtectedRoute allowedRoles={["nutricionista"]}>
              <GerenciarRefeicoes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gerenciar-refeicoes"
          element={
            <ProtectedRoute allowedRoles={["nutricionista"]}>
              <ListaRefeicoes />
            </ProtectedRoute>
          }
        />

        {/* Redirecionamento raiz */}
        <Route path="/" element={<RedirecionarInicio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
