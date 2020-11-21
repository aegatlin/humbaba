import express, {Request, Response} from 'express'
// const express = require('express')
const app = express()
const port = 3000

app.use(express.static("dist"))

app.get('/api', (req: Request, res: Response) => {
  res.send('Hello Worlsssssssssssss!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})