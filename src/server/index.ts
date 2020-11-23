import express, {Request, Response} from 'express'
import { resolve } from 'path'
import { migrate } from 'pigmig'
import { db } from './db.js'
import { eor } from 'eor'

await migrate(resolve("src/db/migrations"))

const app = express()
const port = 3000

app.use(express.json())
app.use(express.static("dist"))

app.get('/api/list', async (req: Request, res: Response) => {
  const lists = await db.getAllLists()
  res.json(lists)
})

app.post('/api/list/new', async (req: Request, res: Response) => {
  const { data: { list } } = req.body
  const [e] = await eor(db.createList(list.name))
  if (e) res.sendStatus(500)
  res.sendStatus(200)
})

app.delete('/api/list/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const [e] = await eor(db.deleteList(id))
  if (e) res.sendStatus(500)
  res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
