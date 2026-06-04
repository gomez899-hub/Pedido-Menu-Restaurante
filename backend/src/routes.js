import { Router } from 'express'
import { supabase } from './supabaseClient.js'
import { analizarPedido } from './claudeService.js'

const router = Router()

router.get('/pedidos', async (req, res) => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/pedidos', async (req, res) => {
  const { mesa, platos } = req.body

  const { data, error } = await supabase
    .from('pedidos')
    .insert([{ mesa, platos, estado: 'pendiente' }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/pedidos/:id/analizar', async (req, res) => {
  const { id } = req.params

  const { data: pedido, error: fetchError } = await supabase
    .from('pedidos')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) return res.status(404).json({ error: 'Pedido no encontrado' })

  const analisis = await analizarPedido(pedido.platos)

  const { data, error } = await supabase
    .from('pedidos')
    .update({ analisis_ia: analisis, estado: 'analizado' })
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.patch('/pedidos/:id/estado', async (req, res) => {
  const { id } = req.params
  const { estado } = req.body

  const { data, error } = await supabase
    .from('pedidos')
    .update({ estado })
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

export default router