import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export default function PanelIA() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    cargarPedidos()

    const canal = supabase
      .channel('pedidos-ia')
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
      .not('analisis_ia', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10)

    setPedidos(data || [])
  }

  if (pedidos.length === 0) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#9ca3af' }}>
        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</p>
        <p style={{ fontSize: '0.9rem' }}>Aún no hay análisis de IA</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Análisis de IA
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {pedidos.map(pedido => {
          const ia = pedido.analisis_ia
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
                borderLeft: '4px solid #7c3aed'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700 }}>Mesa {pedido.mesa}</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{hora}</span>
              </div>

              <div style={{
                background: '#f5f3ff',
                borderRadius: '6px',
                padding: '0.6rem 0.75rem',
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
                color: '#4c1d95'
              }}>
                📋 {ia.resumen}
              </div>

              {ia.alergias && ia.alergias.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#dc2626', marginBottom: '0.35rem' }}>
                    ⚠️ Posibles alergias
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {ia.alergias.map((a, i) => (
                      <span key={i} style={{
                        fontSize: '0.78rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        background: '#fee2e2',
                        color: '#dc2626'
                      }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ia.sugerencias && ia.sugerencias.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a', marginBottom: '0.35rem' }}>
                    💡 Sugerencias
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {ia.sugerencias.map((s, i) => (
                      <span key={i} style={{
                        fontSize: '0.78rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        background: '#dcfce7',
                        color: '#16a34a'
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}