export const getFormatedDate = time => {
  let date = new Date(time)

  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  // Форматирование месяца, дня, часа, минуты и секунды, чтобы имели двузначное представление
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  let formattedTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  return formattedTime
}
//для authReducer
export function jwtDecode(token) {
  try {
    const arrTokenParts = token.split('.')
    if (arrTokenParts.length !== 3) {
      return undefined
    }
    const decodedPart = atob(arrTokenParts[1])
    return JSON.parse(decodedPart)
  } catch (error) {
    return undefined
  }
}

//функция подсчета товаров в корзине
export const getBasketCounter = objBasket => {
  let count = 0
  for (let key in objBasket) {
    count += objBasket[key].count
  }
  return count
}

//получение имени пользователя
export const getUserName = objAuth => {
  const user = objAuth?.payload?.sub?.login
  if (user) {
    return user
  } else {
    return ''
  }
}

//проверка, пользователь isAdmin
export const isAdmin = () => {
  let objToken = JSON.parse(localStorage.authToken)
  if (Object.keys(objToken).length !== 0) {
    let acl = objToken?.payload?.sub?.acl
    // console.log(`isAdm=${acl[acl.length - 1]}`)
    return acl[acl.length - 1] === 'admin' ? true : false
  }
  return false
}

//генерация дерева категорий и подкатегорий по плоскому массиву
export function getCatsTree(arrOfAllCats) {
  //!!!!! делаем копию, чтобы не было мутации состояния напрямую в стейте!!!
  const arrOfCats = JSON.parse(JSON.stringify(arrOfAllCats))

  const tree = []

  for (const category of arrOfCats) {
    category.child = []
    if (!category.parent) {
      //корень parent = null
      tree.push(category)
    } else {
      const childCat = arrOfCats.find(item => item._id === category.parent._id)
      childCat.child.push(category)
    }
  }
  return tree
}
