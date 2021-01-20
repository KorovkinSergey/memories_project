import React from 'react'
import useStyles from './styles'
import {Button, Card, CardActions, CardContent, CardMedia, Typography} from '@material-ui/core'
import moment from 'moment'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import {Delete} from '@material-ui/icons'
import {deletePost, likePost} from '../../../actions/posts'
import {connect} from 'react-redux'
import Likes from './Likes'

function Post({post, setCurrentId, deletePost, likePost}) {
	const classes = useStyles()
	const user = JSON.parse(localStorage.getItem('profile'))


	return (
		<Card className={classes.card}>

			<CardMedia className={classes.media} image={post.selectedFile} title={post.title}/>

			<div className={classes.overlay}>
				<Typography variant="h6">{post.name}</Typography>
				<Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
			</div>

			{(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
				<div className={classes.overlay2}>
					<Button stype={{color: 'white'}} size="small" onClick={() => setCurrentId(post._id)}>
						<MoreHorizIcon fontSize="default"/>
					</Button>
				</div>
			)}

			<div className={classes.details}>
				<Typography variant="body2" color="textSecondary">{post.tags.map(tag => `#${tag}`)}</Typography>
			</div>

			<Typography className={classes.title} variant="h5" gutterBottom>{post.title}</Typography>

			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p" gutterBottom>{post.message}</Typography>
			</CardContent>

			<CardActions className={classes.cardActions}>

				<Button size="small" color="primary" disabled={!user?.result} onClick={() => likePost(post._id)}>
					<Likes post={post} user={user}/>
				</Button>

				{(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) &&
				(<Button size="small" color="primary" onClick={() => deletePost(post._id)}>
					<Delete fontSize="small"/>
					Delete
				</Button>)}

			</CardActions>
		</Card>
	)
}

const dispatchToProps = dispatch => {
	return {
		deletePost: id => dispatch(deletePost(id)),
		likePost: id => dispatch(likePost(id))
	}
}

export default connect(null, dispatchToProps)(Post)
