import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { actualizarEstado } from '../services/api'

const COLORES_ESTADO = {
  pendiente: { bg: '#fef3c7', color: '#d97706', label: 'Pendiente' },
  analizado: { bg: '#ede9fe', color: '#7c3aed', label: 'Analizado' },
  preparando: { bg: '#dbeafe', color: '#2563eb', label: 'Preparando' },
  listo: { bg: '#dcfce7', color: '#16a34a', label: 'Listo' },
}

export default function PanelCocina() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    cargarPedidos()

    const canal = supabase
      .channel('pedidos-cocina')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pedidos'
      }, () => cargarPedidos())
      .subscribe()

    return () => supabase.removeChannel(canal)
  }, [])

  async function cargarPedidos() {
    const { data } = await supabase
      .from('pedidos')
      .select('*')
      .not('estado', 'eq', 'listo')
      .order('created_at', { ascending: true })

    setPedidos(data || [])
  }

  async function cambiarEstado(id, estado) {
    await actualizarEstado(id, estado)
  }

  if (pedidos.length === 0) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#9ca3af' }}>
        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍽️</p>
        <p style={{ fontSize: '0.9rem' }}>Sin pedidos pendientes</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Cocina — {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {pedidos.map(pedido => {
          const estilo = COLORES_ESTADO[pedido.estado] || COLORES_ESTADO.pendiente
          const hora = new Date(pedido.created_at).toLocaleTimeString('es-CO', {
            hour: '2-digit', minute: '2-digit'
          })

          return (
            <div
              key={pedido.id}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '1rem',
                borderLeft: `4px solid ${estilo.color}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Mesa {pedido.mesa}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{hora}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: estilo.bg,
                    color: estilo.color
                  }}>
                    {estilo.label}
                  </span>
                </div>
              </div>

              <ul style={{ margin: '0 0 0.75rem', padding: '0 0 0 1rem', fontSize: '0.875rem', color: '#374151' }}>
                {pedido.platos.map((p, i) => (
                  <li key={i}>{p.nombre}</li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {pedido.estado !== 'preparando' && pedido.estado !== 'listo' && (
                  <button
                    onClick={() => cambiarEstado(pedido.id, 'preparando')}
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      border: '1px solid #2563eb',
                      background: '#fff',
                      color: '#2563eb',
                      cursor: 'pointer'
                    }}
                  >
                    Preparando
                  </button>
                )}
                {pedido.estado === 'preparando' && (
                  <button
                    onClick={() => cambiarEstado(pedido.id, 'listo')}
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      border: '1px solid #16a34a',
                      background: '#fff',
                      color: '#16a34a',
                      cursor: 'pointer'
                    }}
                  >
                    Marcar listo
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}