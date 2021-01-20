import React, {useEffect, useState} from 'react'
import {Container, Grid, Grow} from '@material-ui/core'
import Posts from '../Posts/Posts'
import Form from '../Form/Form'
import useStyles from '../../styles'
import {getPosts} from '../../actions/posts'
import {connect} from 'react-redux'

function Home({getPosts}) {

	const [currentId, setCurrentId] = useState(0)
	const classes = useStyles()

	useEffect(() => {
		getPosts()
	}, [getPosts, currentId])

	return (
		<Grow in>
			<Container>
				<Grid className={classes.mainContainer} container justify="space-between" alignItems="stretch" spacing={3}>
					<Grid item xs={12} sm={7}>
						<Posts setCurrentId={setCurrentId}/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Form currentId={currentId} setCurrentId={setCurrentId}/>
					</Grid>
				</Grid>
			</Container>
		</Grow>
	)
}

const dispatchToProps = dispatch => {
	return {
		getPosts: () => dispatch(getPosts())
	}
}

export default connect(null, dispatchToProps)(Home)
