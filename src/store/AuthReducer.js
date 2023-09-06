import {jwtDecode} from '../api/index'

export function authReducer(state = {}, {type, token}) {
  if (type === 'AUTH_LOGIN') {
    let payload = jwtDecode(token)
    return {token, payload}
  }

  if (type === 'AUTH_LOGOUT') {
    return {}
  }
  return state
}

export const actionAuthLogin = token => ({type: 'AUTH_LOGIN', token})
export const actionAuthLogout = () => ({type: 'AUTH_LOGOUT'})
