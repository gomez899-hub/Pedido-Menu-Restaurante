import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

dotenv.config()

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function analizarPedido(platos) {
  const lista = platos.map(p => `- ${p.nombre} (${p.categoria})`).join('\n')

  const mensaje = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Eres un asistente de restaurante. Analiza este pedido y responde SOLO con un objeto JSON válido, sin texto adicional, sin bloques de código.

Pedido:
${lista}

Responde exactamente con esta estructura:
{
  "resumen": "descripción breve del pedido para cocina",
  "alergias": ["alergia1", "alergia2"],
  "sugerencias": ["sugerencia de plato adicional 1", "sugerencia 2"]
}`
      }
    ]
  })

const texto = mensaje.content[0].text
  const limpio = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(limpio)
}