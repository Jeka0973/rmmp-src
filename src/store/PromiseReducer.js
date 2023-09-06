//promiseReducer редьюсер

export function promiseReducer(state = {}, {type, promiseName, status, payload, error}) {
  if (type === 'PROMISE') {
    return {
      ...state,
      [promiseName]: {status, payload, error},
    }
  }
  return state
}

const actionPending = promiseName => ({type: 'PROMISE', promiseName, status: 'PENDING'})
const actionFulfilled = (promiseName, payload) => ({
  type: 'PROMISE',
  promiseName,
  status: 'FULFILLED',
  payload,
})
const actionRejected = (promiseName, error) => ({
  type: 'PROMISE',
  promiseName,
  status: 'REJECTED',
  error,
})

export const actionPromise = (promiseName, promise) => async dispatch => {
  dispatch(actionPending()) //сигнализируем redux, что промис начался
  try {
    const payload = await promise //ожидаем промиса
    dispatch(actionFulfilled(promiseName, payload)) //сигнализируем redux, что промис успешно выполнен
    return payload //в месте запуска store.dispatch с этим thunk можно так же получить результат промиса
  } catch (error) {
    dispatch(actionRejected(promiseName, error)) //в случае ошибки - сигнализируем redux, что промис несложился
  }
}
