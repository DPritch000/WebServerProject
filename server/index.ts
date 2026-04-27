import 'dotenv/config'
import express from 'express'
import apiRouter from './routes/api'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())

app.use('/api', apiRouter)

app.get('/', (_req, res) => res.send('Hello World!'))

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})