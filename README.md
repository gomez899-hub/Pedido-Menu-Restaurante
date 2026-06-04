# 🍽️ Asistente de Pedidos con IA

Aplicación web para gestión de pedidos de restaurante con análisis inteligente usando Claude AI. Tres paneles en tiempo real: toma de pedidos, vista de cocina y análisis de IA.

## ¿Qué hace?

- **Panel de mesa** — el mesero selecciona platos y envía el pedido
- **Panel de cocina** — ve los pedidos llegar en tiempo real y actualiza su estado
- **Panel de IA** — Claude analiza cada pedido y devuelve un resumen para cocina, posibles alergias detectadas y sugerencias de upselling

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Base de datos | Supabase (PostgreSQL + Realtime) |
| IA | Claude API (claude-haiku-4-5) |

## Estructura del proyecto

```
asistente-pedidos-ia/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── PanelMesa.jsx
│       │   ├── PanelCocina.jsx
│       │   └── PanelIA.jsx
│       ├── services/
│       │   ├── api.js
│       │   └── supabaseClient.js
│       └── App.jsx
└── backend/
    └── src/
        ├── index.js
        ├── routes.js
        ├── claudeService.js
        └── supabaseClient.js
```

## Requisitos previos

- Node.js 20+
- Cuenta en [Supabase](https://supabase.com)
- API Key de [Anthropic](https://console.anthropic.com)

## Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/asistente-pedidos-ia.git
cd asistente-pedidos-ia
```

### 2. Crear la tabla en Supabase

En el SQL Editor de tu proyecto Supabase ejecuta:

```sql
create table pedidos (
  id uuid default gen_random_uuid() primary key,
  mesa integer not null,
  platos jsonb not null default '[]',
  estado text not null default 'pendiente',
  analisis_ia jsonb,
  created_at timestamp with time zone default now()
);

alter table pedidos enable row level security;

create policy "acceso publico" on pedidos
  for all using (true);

alter publication supabase_realtime add table pedidos;
```

### 3. Configurar el backend

```bash
cd backend
npm install
```

Crea el archivo `.env`:

```
SUPABASE_URL=tu_project_url
SUPABASE_KEY=tu_anon_key
ANTHROPIC_API_KEY=tu_api_key
PORT=3001
```

### 4. Configurar el frontend

```bash
cd ../frontend
npm install
```

Crea el archivo `.env`:

```
VITE_SUPABASE_URL=tu_project_url
VITE_SUPABASE_KEY=tu_anon_key
VITE_API_URL=http://localhost:3001/api
```

## Correr el proyecto

Abre dos terminales:

**Terminal 1 — Backend:**
```bash
cd backend
node src/index.js
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Abre el navegador en `http://localhost:5173`

## Cómo funciona el análisis de IA

Cuando se envía un pedido, el backend llama a Claude con la lista de platos y recibe un JSON estructurado con tres campos:

```json
{
  "resumen": "Pedido completo: plato fuerte con proteína, sopa, entrada, bebida y postre",
  "alergias": ["gluten", "lácteos", "huevo"],
  "sugerencias": ["Tabla de quesos y embutidos", "Brownie de chocolate"]
}
```

Este análisis se guarda en Supabase y se muestra en el panel de IA en tiempo real.