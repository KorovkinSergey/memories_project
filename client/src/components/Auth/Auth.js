import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {connect} from 'react-redux'
import {LockOutlined} from '@material-ui/icons'
import GoogleLogin from 'react-google-login'
import {Avatar, Button, Container, Grid, Paper, Typography} from '@material-ui/core'
import {googleAuthSuccess, signIn, signUn} from '../../actions/auth'
import Input from './Input'
import Icon from './icon'
import useStyles from './styles'


function Auth({googleAuthSuccess, signIn, signUn}) {

	const classes = useStyles()

	const history = useHistory()
	const [isSignup, setIsSignup] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFromData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: ''
	})

	const handleShowPassword = () => setShowPassword(prevShowPassword => !prevShowPassword)

	const handleSubmit = (e) => {
		e.preventDefault()

		if(isSignup) {
			signUn(formData, history)
		} else {
			signIn(formData, history)
		}
	}

	const handleChange = e => setFromData({...formData, [e.target.name]: e.target.value})


	const switchMode = () => {
		setIsSignup(prevIsSignup => !prevIsSignup)
		setShowPassword(false)
	}

	const googleSuccess = async (res) => {
		const result = res?.profileObj
		const token = res?.tokenId
		try {
			googleAuthSuccess(result, token)

			history.push('/')
		} catch (error) {
			console.log(error)
		}
	}

	const googleFailure = (error) => {
		console.log(error)
		console.log("Google Sign In ws unsuccessful. Try Again Later")
	}

	return (
		<Container component="main" maxWidth="xs">
			<Paper className={classes.paper} elevation={3}>
				<Avatar className={classes.avatar}>
					<LockOutlined/>
				</Avatar>
				<Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
				<form className={classes.form} onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						{
							isSignup && (
								<>
									<Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half/>
									<Input name="lastName" label="Last Name" handleChange={handleChange} half/>
								</>
							)
						}
						<Input
							name="email"
							label="Email Address"
							handleChange={handleChange}
							type="email"
						/>
						<Input
							name="password"
							label="password"
							handleChange={handleChange}
							type={showPassword ? " text" : "password"}
							handleShowPassword={handleShowPassword}
						/>
						{isSignup &&
						<Input
							name="confirmPassword"
							label="Repeat Password"
							handleChange={handleChange}
							type="password"
						/>}
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>{isSignup ? 'Sign Up' : 'Sign In'}
					</Button>
					<GoogleLogin
						clientId="52594382505-mitalqublm05prfgk2au80ilc553qca9.apps.googleusercontent.com"
						render={(renderProps) => (
							<Button
								className={classes.googleButton}
								color="primary"
								fullWidth
								onClick={renderProps.onClick}
								disabled={renderProps.disabled}
								startIcon={<Icon/>}
								variant="contained"
							>
								Google Sign In
							</Button>
						)}
						onSuccess={googleSuccess}
						onFailure={googleFailure}
						cookiePolicy="single_host_origin"
					/>
					<Grid container justify="flex-end">
						<Grid item>
							<Button onClick={switchMode}>
								{isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
							</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
		</Container>
	)
}


const dispatchToProps = dispatch => {
	return {
		googleAuthSuccess: (result, token) => dispatch(googleAuthSuccess(result, token)),
		signIn: (formData, history) => dispatch(signIn(formData, history)),
		signUn: (formData, history) => dispatch(signUn(formData, history))
	}
}

export default connect(null, dispatchToProps)(Auth)
