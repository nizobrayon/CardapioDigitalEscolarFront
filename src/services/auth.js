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
