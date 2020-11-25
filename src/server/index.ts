import express, { Request, Response } from 'express'
import { db } from './db.js'
import { eor } from 'eor'
import pigmig from 'pigmig'

await pigmig.migrate('src/db/migrations')

const app = express()
const port = 3000

app.use(express.json())
app.use(express.static('dist'))

app.get('/api/list', async (req: Request, res: Response) => {
  const lists = await db.list.all()
  res.json(lists)
})

app.post('/api/list/new', async (req: Request, res: Response) => {
  const { data: { list } } = req.body
  const [e] = await eor(db.list.create(list.name))
  if (e) res.sendStatus(500)
  res.sendStatus(200)
})

app.delete('/api/list/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const [e] = await eor(db.list.delete(id))
  if (e) res.sendStatus(500)
  res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
