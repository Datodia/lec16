const { Router } = require("express");
const postsModel = require("../models/posts.model");


const postsRouter = Router()


postsRouter.get('/', async (req, res) => {
    console.log(req.userId, "req.userId")
    const posts = await postsModel.find()
    res.json(posts)
})


module.exports = postsRouter