import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getTipoUsuario } from "../services/auth";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const usuario = isAuthenticated();
  const tipoUsuario = usuario ? getTipoUsuario(usuario) : null;

  if (!usuario) {
    return <Navigate to="/loginAluno" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(tipoUsuario)) {
    if (tipoUsuario === "aluno") {
      return <Navigate to="/home" replace />;
    }
    if (tipoUsuario === "nutricionista") {
      return <Navigate to="/criar-refeicao" replace />;
    }
    return <Navigate to="/loginAluno" replace />;
  }

  return children;
}

export default ProtectedRoute;
