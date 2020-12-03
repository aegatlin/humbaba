import express, { Request, Response } from 'express'
import { List, ListItem, ListMeta, Payload } from '../types.js'
import { db } from './db.js'

const listRouter = express.Router()

listRouter
  .route('/')
  .get(async (req: Request, res: Response<Payload<ListMeta[]>>) => {
    const ls = await db.lists.all()
    const payload: Payload<ListMeta[]> = { data: ls }
    res.json(payload)
  })
  .post(async (req: Request, res: Response<Payload<ListMeta>>) => {
    const name = req.body.data.list.name
    await db.lists.create({ name })
    res.sendStatus(200)
  })

listRouter
  .route('/:id')
  .delete(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    await db.lists.delete(id)
    res.sendStatus(200)
  })
  .get(async (req: Request, res: Response<Payload<List>>) => {
    const listId = parseInt(req.params.id)
    const { id, name } = await db.lists.read(listId)
    const items = await db.listItems.allForList(listId)
    const list: List = { id, name, items }
    const payload: Payload<List> = { data: list }
    res.json(payload)
  })

listRouter
  .route('/:id/items')
  .post(
    async (req: Request<any, any, Payload<ListItem>, any>, res: Response) => {
      const listId: number = parseInt(req.params.id)
      const { content }: ListItem = req.body.data
      await db.listItems.create({ listId, content })
      res.sendStatus(200)
    }
  )

listRouter
  .route('/:listId/items/:itemId')
  .put(
    async (req: Request<any, any, Payload<ListItem>, any>, res: Response) => {
      const listId: number = parseInt(req.params.listId)
      const itemId: number = parseInt(req.params.itemId)
      const { content } = req.body.data
      db.listItems.update({ id: itemId, listId, content })
      res.sendStatus(200)
    }
  )
  .delete(async (req: Request, res: Response) => {
    const listId: number = parseInt(req.params.listId)
    const itemId: number = parseInt(req.params.itemId)
    db.listItems.delete(itemId, listId)
    res.sendStatus(200)
  })

export default listRouter
