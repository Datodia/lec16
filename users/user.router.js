const { Router } = require("express");
const usersModel = require("../models/users.model");
const { isValidObjectId } = require("mongoose");

const userRouter = Router()

userRouter.get('/', async (req, res) => {
    const users = await usersModel.find().populate('posts', 'title content').select('-password')
    res.json(users)
})


userRouter.get('/:id', async (req, res) => {
    const {id} = req.params
    if(!isValidObjectId(id)) return res.status(400).json({message: 'Wrong Id format'})

    const user = await usersModel.findById(id).select('-password')
    if(!user) return res.status(404).json({message: 'user not found'})
    res.json(user)
})


userRouter.delete('/:id', async (req, res) => {
    const {id} = req.params
    if(!isValidObjectId(id)) return res.status(400).json({message: 'Wrong Id format'})

    const user = await usersModel.findOneAndDelete(id)
    if(!user) return res.status(400).json({message: 'user not deleted'})
    res.json({message: 'user deleted succesfully', data: user})
})


userRouter.put('/:id', async (req, res) => {
    const {id} = req.params
    if(!isValidObjectId(id)) return res.status(400).json({message: 'Wrong Id format'})

    const {fullName, email} = req.body
    const updateRequest = {}
    if(fullName) updateRequest.fullName = fullName
    if(email) updateRequest.email = email

    const user = await usersModel.findOneAndUpdate(id, updateRequest, {new: true})
    if(!user) return res.status(400).json({message: 'user not updated'})
    res.json({message: 'user updated succesfully', data: user})
})


module.exports = userRouter