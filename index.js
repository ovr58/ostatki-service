import express from 'express'

import router from './routes/index.js'
import sequelize from './config/database.js'

const app = express()
app.use(express.json())
app.use(router)

const PORT = process.env.PORT || 3000

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
})


export default app