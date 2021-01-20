import {AUTH, LOGOUT} from '../constants/actionTypes'
import * as api from '../api/index'

export const googleAuthSuccess = (result, token) => {
	return {type: AUTH, data: {result, token}}
}

export const googleLogout = () => {
	return {type: LOGOUT}
}

export const signIn = (formData, history) => {
	return async dispatch => {
		try {
			const {data} = await api.signIn(formData)

			dispatch({type: AUTH, data})
			history.push('/')
		} catch (error) {
			console.log(error)
		}
	}
}

export const signUn = (formData, history) => {
	return async dispatch => {
		try {
			const {data} = await api.signUp(formData)

			dispatch({type: AUTH, data})
			history.push('/')
		} catch (error) {
			console.log(error)
		}
	}
}
