const express = require('express')
const PostMessage = require('../models/postMessage.js')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
	try {

		const token = req.headers.authorization.split(' ')[1]
		const isCustomAuth = token.length < 500

		let decodedData
		if (token && isCustomAuth) {
			decodedData = jwt.verify(token, 'test')

			req.userId = decodedData?.id
		} else {
			decodedData = jwt.decode(token)
			req.userId = decodedData?.sub
		}

		next()
	} catch (error) {
		console.log(error)
	}
}

const router = express.Router()

router.get('/', async (req, res) => {
	try {
		const postMessages = await PostMessage.find()

		res.status(200).json(postMessages)
	} catch (error) {

		res.status(404).json({message: error.message})
	}
})


router.post('/', auth, async (req, res) => {

	const post = req.body
	const newPost = new PostMessage({...post, creator: req.userId, createAt: new Date().toISOString()})

	try {
		await newPost.save()
		res.status(201).json(newPost)
	} catch (error) {
		res.status(409).json({message: error.message})
	}
})


router.patch('/:id', auth, async (req, res) => {
	const {id: _id} = req.params
	const post = req.body

	if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id ')

	const updatePost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true})

	res.json(updatePost)
})


router.delete('/:id', auth, async (req, res) => {
	const {id} = req.params
	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id ')

	await PostMessage.findByIdAndDelete(id)
	res.json({message: 'Post deleted successfully'})
})


router.patch('/:id/likePost', auth, async (req, res) => {
	const {id} = req.params

	if (!req.userId) return res.json({message: 'Unauthenticated'})

	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id ')


	const post = await PostMessage.findById(id)
	const index = post.likes.findIndex(id => id === String(req.userId))
	if (index === -1) {
		post.likes.push(req.userId)
	} else {
		post.likes = post.likes.filter(id => id !== String(req.userId))
	}
	const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})

	res.json(updatedPost)
})


module.exports = router
