import PanelMesa from './components/PanelMesa'
import PanelCocina from './components/PanelCocina'
import PanelIA from './components/PanelIA'

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0.875rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <span style={{ fontSize: '1.4rem' }}>🍽️</span>
        <h1 style={{ fontSize: '1rem', fontWeight: 700, color: '#111' }}>
          Asistente de Pedidos con IA
        </h1>
      </header>

      <main style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        padding: '1rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <PanelMesa />
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <PanelCocina />
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <PanelIA />
        </div>
      </main>
    </div>
  )
}