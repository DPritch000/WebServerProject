import 'dotenv/config'
import express from 'express'
import apiRouter from './routes/api'

const PORT = process.env.PORT || 3000
const app = express()

// CORS middleware for frontend access
app.use((req, res, next): void => {
  const origin = req.headers.origin
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']
  
  if (allowedOrigins.includes(origin || '')) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }
  
  next()
})

app.use(express.json())

app.use('/api', apiRouter)

app.get('/', (_req, res) => res.send('Backend is running!'))

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`Backend ready for requests from http://localhost:5173`)
})