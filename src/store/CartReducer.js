export function cartReducer(state = {}, {type, count, good}) {
  if (type === 'CART_ADD') {
    const {_id} = good
    let newCount
    if (count >= 0) {
      if (state[_id]) {
        newCount = state[_id].count + count
      } else {
        newCount = count
      }
      return {
        ...state,
        [_id]: {
          good: good,
          count: newCount,
        },
      }
    } else {
      return {...state}
    }
  } else if (type === 'CART_SUB') {
    const {_id} = good
    let newCount = state[_id].count - count
    if (newCount <= 0) {
      const newState = {...state}
      delete newState[_id]
      return newState
    } else {
      return {
        ...state,
        [_id]: {
          good: good,
          count: newCount,
        },
      }
    }
  } else if (type === 'CART_DEL') {
    const {_id} = good
    const newState = {...state}
    delete newState[_id]
    return newState
  } else if (type === 'CART_SET') {
    const {_id} = good
    const newCount = count
    if (newCount > 0) {
      return {
        ...state,
        [_id]: {
          good: good,
          count: newCount,
        },
      }
    } else {
      const newState = {...state}
      delete newState[_id]
      return newState
    }
  } else if (type === 'CART_CLEAR') {
    return (state = {})
  } else return state
}

// Добавление товара. Должен добавлять новый ключ в state, или обновлять, если ключа в state ранее не было, увеличивая количество
export const actionCartAdd = (good, count = 1) => ({type: 'CART_ADD', count, good})
// Уменьшение количества товара. Должен уменьшать количество товара в state, или удалять его если количество будет 0 или отрицательным
export const actionCartSub = (good, count = 1) => ({type: 'CART_SUB', count, good})
// Удаление товара. Должен удалять ключ из state
export const actionCartDel = good => ({type: 'CART_DEL', good})
// Задание количества товара. В отличие от добавления и уменьшения, не учитывает того количества, которое уже было в корзине, а тупо назначает количество поверху (или создает новый ключ, если в корзине товара не было). Если count 0 или отрицательное число - удаляем ключ из корзины;
export const actionCartSet = (good, count = 1) => ({type: 'CART_SET', count, good})
// Очистка корзины. state должен стать пустым объектом {}
export const actionCartClear = () => ({type: 'CART_CLEAR'})
