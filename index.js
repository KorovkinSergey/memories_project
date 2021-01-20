const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')
const postRoutes = require('./routes/posts.js')
const userRoutes = require('./routes/users.js')
const path = require('path')

const app = express()

app.use(bodyParser.json({limit: '30mb', extended : true}))
app.use(bodyParser.urlencoded({limit: '30mb', extended : true}))
app.use(cors())
app.use('/posts', postRoutes)
app.use('/user', userRoutes)

if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.join(__dirname, 'client', 'build')))
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}


const PORT = process.env.PORT || 5000


async function start() {
	try {
		await mongoose.connect(config.get('mongoUri'), {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		app.listen(PORT, () => console.log(`Server running port: ${PORT}`))
	} catch (e) {
		console.log('Server Error', e.message)
		process.exit(1)
	}
}

start()


