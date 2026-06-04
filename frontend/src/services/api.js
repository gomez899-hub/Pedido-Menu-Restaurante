const API_URL = import.meta.env.VITE_API_URL

export async function crearPedido(mesa, platos) {
  const res = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mesa, platos })
  })
  return res.json()
}

export async function analizarPedido(id) {
  const res = await fetch(`${API_URL}/pedidos/${id}/analizar`, {
    method: 'POST'
  })
  return res.json()
}

export async function actualizarEstado(id, estado) {
  const res = await fetch(`${API_URL}/pedidos/${id}/estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado })
  })
  return res.json()
}