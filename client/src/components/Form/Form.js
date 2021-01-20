import React, {useEffect, useState} from 'react'
import FileBase from 'react-file-base64'

import useStyles from './styles'
import {Button, Paper, TextField, Typography} from '@material-ui/core'
import {connect} from 'react-redux'
import {createPost, updatePost} from '../../actions/posts'

function Form({createPost, currentId, updatePost, posts, setCurrentId}) {
	const post = currentId ? posts.find(p => p._id === currentId) : null
	const classes = useStyles()
	const user = JSON.parse(localStorage.getItem('profile'))
	const [postData, setPostData] = useState({
		title: '',
		message: '',
		tags: '',
		selectedFile: ''
	})

	useEffect(() => {
		if (post) setPostData(post)
	}, [post])

	const handleSubmit = (e) => {
		e.preventDefault()

		currentId === 0
			? createPost({...postData, name: user?.result?.name})
			: updatePost(currentId, {...postData, name: user?.result?.name})

		clear()
	}

	const clear = () => {
		setCurrentId(0)
		setPostData({title: '', message: '', tags: '', selectedFile: ''})
	}

	if (!user?.result?.name) {
		return (
			<Paper className={classes.paper}>
				<Typography variant="h6" align="center">
					Please Sign In to create you owm memories and like other's memories
				</Typography>
			</Paper>
		)
	}

	return (
		<Paper className={classes.paper}>
			<form autoComplete='off' className={`${classes.form} ${classes.root}`} onSubmit={handleSubmit}>
				<Typography variant='h6'>{currentId ? 'Editing' : 'Creating'} a Memory</Typography>

				<TextField
					name="title"
					variant="outlined"
					label="Title"
					fullWidth
					required
					value={postData.title}
					onChange={e => setPostData({...postData, title: e.target.value})}
				/>
				<TextField
					name="message"
					variant="outlined"
					label="Message"
					fullWidth
					required
					value={postData.message}
					onChange={e => setPostData({...postData, message: e.target.value})}
				/>
				<TextField
					name="tags"
					variant="outlined"
					label="Tags"
					fullWidth
					required
					value={postData.tags}
					onChange={e => setPostData({...postData, tags: e.target.value.split(',')})}
				/>
				<div className={classes.fileInput}>
					<FileBase
						type="file"
						multiple={false}
						onDone={({base64}) => setPostData({...postData, selectedFile: base64})}
					/>
				</div>
				<Button
					className={classes.buttonSubmit}
					variant="contained"
					color="primary"
					size="large"
					type="submit"
					fullWidth
				>
					Submit
				</Button>
				<Button
					variant="contained"
					color="secondary"
					size="small"
					onClick={clear}
					fullWidth
				>
					Clear
				</Button>
			</form>
		</Paper>
	)
}

const stateToProps = state => {
	return {
		posts: state.posts
	}
}

const dispatchToProps = dispatch => {
	return {
		createPost: post => dispatch(createPost(post)),
		updatePost: (currentId, post) => dispatch(updatePost(currentId, post))
	}
}

export default connect(stateToProps, dispatchToProps)(Form)
