const { Router } = require("express");
const postsModel = require("../models/posts.model");
const usersModel = require("../models/users.model");


const postsRouter = Router()


postsRouter.get('/', async (req, res) => {
    console.log(req.userId, "req.userId")
    const posts = await postsModel.find().populate('user', 'email fullName')
    res.json(posts)
})

postsRouter.post('/', async (req, res) => {
    const {title, content} = req.body
    if(!title || !content) return res.status(400).json({message: "title or content is requried"})
    const newPost = await postsModel.create({title, content, user: req.userId})
    await usersModel.findByIdAndUpdate(req.userId, {$push: {posts: newPost._id} })
    res.status(201).json({newPost})
})


module.exports = postsRouter