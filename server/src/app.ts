


import express from 'express'
import authRouter from './routes/auth.routes'

import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.json({message: 'Homepage'})
})


app.use('/api/auth', authRouter)




export default app