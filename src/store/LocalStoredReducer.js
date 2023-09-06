export function localStoredReducer(originalReducer, localStorageKey) {
  const storedState = localStorage.getItem(localStorageKey)

  return function wrapper(state, action) {
    if (state === undefined && storedState) {
      return JSON.parse(storedState)
    }

    const newState = originalReducer(state, action)

    if (newState !== state) {
      localStorage.setItem(localStorageKey, JSON.stringify(newState))
    }

    return newState
  }
}
