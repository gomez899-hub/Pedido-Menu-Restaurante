import { useState } from 'react'
import { crearPedido, analizarPedido } from '../services/api'

const MENU = [
  { nombre: 'Bandeja paisa', categoria: 'plato fuerte' },
  { nombre: 'Sancocho de gallina', categoria: 'sopa' },
  { nombre: 'Ajiaco', categoria: 'sopa' },
  { nombre: 'Trucha a la plancha', categoria: 'plato fuerte' },
  { nombre: 'Ensalada César', categoria: 'entrada' },
  { nombre: 'Patacones con hogao', categoria: 'entrada' },
  { nombre: 'Jugo de lulo', categoria: 'bebida' },
  { nombre: 'Agua de panela', categoria: 'bebida' },
  { nombre: 'Flan de caramelo', categoria: 'postre' },
  { nombre: 'Arroz con leche', categoria: 'postre' },
]

export default function PanelMesa() {
  const [mesa, setMesa] = useState(1)
  const [seleccionados, setSeleccionados] = useState([])
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  function togglePlato(plato) {
    setSeleccionados(prev =>
      prev.find(p => p.nombre === plato.nombre)
        ? prev.filter(p => p.nombre !== plato.nombre)
        : [...prev, plato]
    )
  }

  async function enviarPedido() {
    if (seleccionados.length === 0) return
    setCargando(true)
    setMensaje(null)

    const pedido = await crearPedido(mesa, seleccionados)
    await analizarPedido(pedido.id)

    setSeleccionados([])
    setCargando(false)
    setMensaje(`✓ Pedido de mesa ${mesa} enviado y analizado`)
    setTimeout(() => setMensaje(null), 4000)
  }

  const categorias = [...new Set(MENU.map(p => p.categoria))]

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Tomar pedido
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.9rem', color: '#666' }}>Mesa</label>
        <select
          value={mesa}
          onChange={e => setMesa(Number(e.target.value))}
          style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}
        >
          {[1,2,3,4,5,6,7,8].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {categorias.map(cat => (
        <div key={cat} style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem' }}>
            {cat}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {MENU.filter(p => p.categoria === cat).map(plato => {
              const activo = seleccionados.find(p => p.nombre === plato.nombre)
              return (
                <button
                  key={plato.nombre}
                  onClick={() => togglePlato(plato)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '20px',
                    border: '1.5px solid',
                    borderColor: activo ? '#4f46e5' : '#ddd',
                    background: activo ? '#ede9fe' : '#fff',
                    color: activo ? '#4f46e5' : '#444',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {plato.nombre}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {seleccionados.length > 0 && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f5f3ff', borderRadius: '8px', fontSize: '0.85rem', color: '#4f46e5' }}>
          {seleccionados.map(p => p.nombre).join(' · ')}
        </div>
      )}

      <button
        onClick={enviarPedido}
        disabled={cargando || seleccionados.length === 0}
        style={{
          marginTop: '1rem',
          width: '100%',
          padding: '0.75rem',
          background: cargando || seleccionados.length === 0 ? '#e5e7eb' : '#4f46e5',
          color: cargando || seleccionados.length === 0 ? '#9ca3af' : '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.95rem',
          fontWeight: 600,
          cursor: cargando || seleccionados.length === 0 ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s'
        }}
      >
        {cargando ? 'Enviando y analizando...' : 'Enviar pedido'}
      </button>

      {mensaje && (
        <p style={{ marginTop: '0.75rem', color: '#16a34a', fontSize: '0.9rem', textAlign: 'center' }}>
          {mensaje}
        </p>
      )}
    </div>
  )
}