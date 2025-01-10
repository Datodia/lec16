const express = require('express')
const connectToDb = require('./db/connectToDb')
const userRouter = require('./users/user.router')
const authRouter = require('./auth/auth.router')
const postsRouter = require('./posts/posts.router')
const isAuth = require('./middlewares/isAuth.middleware')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

connectToDb()

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/posts', isAuth, postsRouter)


app.listen(3000, () => {
    console.log('server runnign on http://localhost:3000')
})