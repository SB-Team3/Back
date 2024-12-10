import express from 'express'
import bodyParser from 'body-parser'
import mainRoutes from './router/mainRouter.js'
import listsRoutes from './router/listsRouter.js'
import chatRoutes from './router/chatRouter.js'
import profileRoutes from './router/profileRouter.js'
import authRoutes from './router/authRouter.js'
import partnershipRoutes from './router/partnershipRouter.js'
import { config } from './server/config/config.js'
import { db } from './server/config/database.js'

const app = express()

app.use(bodyParser.json())

app.use('/main', mainRoutes)
app.use('/lists', listsRoutes)
app.use('/chat', chatRoutes)
app.use('/profile', profileRoutes)
app.use('/auth', authRoutes)
app.use('/partnership', partnershipRoutes)

db.getConnection()
app.listen(config.host.port)