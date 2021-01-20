import React from 'react'
import Post from './Post/Post'
import useStyles from './styles'
import {connect} from 'react-redux'
import {CircularProgress, Grid} from '@material-ui/core'

function Posts( { posts, setCurrentId }) {
	const classes = useStyles()

	return (
		!posts.length
			? <CircularProgress/>
			: (
				<Grid className={classes.container} container alignItems="stretch" spacing={3}>
					{
						posts.map( post => (
							<Grid item key={post._id} xs={12} sm={6}>
								<Post post={post} setCurrentId={setCurrentId}/>
							</Grid>
						))
					}
				</Grid>
			)
	)
}

const stateToProps = state => {
	return {
		posts: state.posts
	}
}


export default connect(stateToProps, null)(Posts)
