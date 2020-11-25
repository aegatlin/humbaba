import express from 'express'
import pigmig from 'pigmig'
import listRouter from './listRouter.js'

await pigmig.migrate('src/db/migrations')

const app = express()
const port = 3000

app.use(express.json())
app.use(express.static('dist'))
app.use('/api/lists', listRouter)

app.listen(port, () => {
  console.log(`Humbaba is listening at http://localhost:${port}`)
})
