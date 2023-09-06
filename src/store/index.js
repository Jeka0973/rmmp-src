import {promiseReducer} from './PromiseReducer'
import {localStoredReducer} from './LocalStoredReducer'
import {cartReducer} from './CartReducer'
import {authReducer} from './AuthReducer'
import {headerTextReducer} from './HeaderTextReducer'
import {configureStore} from '@reduxjs/toolkit'
//import {combineReducers} from 'redux'
import {combineReducers} from '@reduxjs/toolkit'

const reducer = combineReducers({
  allGoods: promiseReducer,
  auth: localStoredReducer(authReducer, 'authToken'),
  busk: localStoredReducer(cartReducer, 'basket'),
  contentHeader: headerTextReducer,
})

const store = configureStore({
  reducer,
})

export default store
