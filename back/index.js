require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

app.use(express.json())
app.use(cors())

const Models = require("./models")
/* Logic of Routers */
const postRouter = require('./routes/Worterbuch')
const usersRoutes = require("./routes/Identification")
const loginRoutes = require("./routes/Login")

app.use("/words", postRouter)
app.use("/users", usersRoutes)
app.use("/auth", loginRoutes)

/* When the API gets started, it will go over every single table that exists on the models folder */
Models.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
})