import express, { Request, Response } from 'express'
import { List, ListDb, ListItem, ListItemDb, Payload } from '../types.js'
import { db } from './db.js'

const listRouter = express.Router()

listRouter.get('/', async (req: Request, res: Response) => {
  const result = await db.query<ListDb>('SELECT * FROM lists;')
  const lists: List[] = result.rows.map(({ id, name }) => ({
    id: parseInt(id),
    name
  }))
  const payload: Payload<List[]> = { data: lists } 
  res.json(payload)
})

listRouter.post('/', async (req: Request, res: Response) => {
  const name = req.body.data.list.name
  await db.query<ListDb>('INSERT INTO lists (name) VALUES ($1)', [name])
  res.sendStatus(200)
})

listRouter.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  await db.query('DELETE FROM lists WHERE id=$1', [id])
  res.sendStatus(200)
})

listRouter.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const result = await db.query<ListItemDb>(
    'SELECT * FROM list_items WHERE list_id=$1 ORDER BY id',
    [id]
  )
  const listItems: ListItem[] = result.rows.map(({ id, list_id, content }) => ({
    id: parseInt(id),
    listId: parseInt(list_id),
    content
  }))
  res.json({ data: { listItems } })
})

export default listRouter
