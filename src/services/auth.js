export const USUARIO_STORAGE_KEY = "cardapio_usuario";

export function getUsuarioLogado() {
  try {
    const raw = localStorage.getItem(USUARIO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUsuarioLogado(usuario) {
  localStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(usuario));
}

export function clearUsuarioLogado() {
  localStorage.removeItem(USUARIO_STORAGE_KEY);
}

export function getIdUsuario(usuario) {
  return usuario?.idusuario ?? usuario?.idUsuario ?? null;
}

export function getTipoUsuario(usuario) {
  const u = usuario ?? getUsuarioLogado();
  return u?.tipoUsuario ?? null;
}

export function isAluno(usuario) {
  return getTipoUsuario(usuario) === "aluno";
}

export function isNutricionista(usuario) {
  return getTipoUsuario(usuario) === "nutricionista";
}

export function isAuthenticated() {
  return getUsuarioLogado() !== null;
}
