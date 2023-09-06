import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {actionPromise} from '../../store/PromiseReducer'
import {gqlFunc} from '../../utils'
import {useNavigate} from 'react-router-dom'
import {categoryUpsert, queryAllCategories} from '../../const'

function InputCategoryChange({currentCategory, action}) {
  //action - новая корневая (newRootCat) , новая подкатегория (newSubCat), новая категория в подкатегории (newCat), редактирование  (editCurrentCat)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [newCategoryName, setNewCategoryName] = useState(
    currentCategory !== undefined ? currentCategory.name : ''
  )

  let actionTodo
  action === 'newRootCat'
    ? (actionTodo = 'добавить корневую')
    : action === 'newSubCat'
    ? (actionTodo = 'добавить под')
    : action === 'editCurrentCat'
    ? (actionTodo = 'редактировать')
    : (actionTodo = 'добавить')

  // useEffect(() => {
  //   if (currentCategory !== undefined) {
  //     navigate(
  //       `/category/${currentCategory._id}?categoryName=${encodeURIComponent(newCategoryName)}`
  //     )
  //   }
  //   console.log(`категория:${currentCategory._id}  имя:${newCategoryName}`)
  //   setNavigation(false)
  // }, [navigation])

  // условие для полей добавления корневой категории или редактирования

  const categoryFields = (category, categoryName, action) => {
    let catFields = {}

    console.log(`смотрим actions в categoryFields >`)
    console.log(`action = ${action}`)
    // console.log(`categoryName = ${categoryName}`)
    // console.log(`***** categorParent *******`)
    // console.log(category)

    if (action === 'newRootCat') {
      catFields = {
        // добавление корневой
        name: categoryName,
        parent: null,
        goods: [],
        subCategories: [],
      }
    } else if (action === 'newCat') {
      catFields = {
        // добавление новой категории к текущей в ветке
        name: categoryName,
        parent: {
          _id: category.parent,
        },
        goods: [],
        subCategories: [],
      }
    } else if (action === 'editCurrentCat') {
      catFields = {
        // редактирование выбранной категории
        _id: category._id,
        name: categoryName,
      }
    } else {
      catFields = {
        // добавление новой подкатегории к текущей  ветке
        name: categoryName,
        parent: {
          _id: category._id,
        },
        goods: [],
        subCategories: [],
      }
    }
    return catFields
  }

  const handleCategoryActions = async (currentCategory, newCategoryName, action) => {
    if (window.confirm(`Вы действительно хотите ${actionTodo} категорию ${newCategoryName}?`)) {
      // console.log('****** параметры запроса *********')
      // console.log(`Че делаем - ${actionTodo} > ${action}`)
      // console.log(' объект для запроса >')
      // console.log(categoryFields(currentCategory, newCategoryName, action))
      await dispatch(
        actionPromise(
          'getAllCategories',
          gqlFunc(categoryUpsert, {
            categoryEdit: categoryFields(currentCategory, newCategoryName, action),
          })
        )
      )
      // setNavigation(true)
      await dispatch(actionPromise('getAllCategories', gqlFunc(queryAllCategories, {})))
      navigate(
        `/category/${currentCategory._id}?categoryName=${encodeURIComponent(newCategoryName)}`
      )
    }
  }

  if (action === 'newRootCat' || action === 'editCurrentCat') {
    return (
      <input
        type="text"
        value={newCategoryName}
        onChange={e => setNewCategoryName(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            handleCategoryActions(currentCategory, newCategoryName, action)
          }
        }}
      />
    )
  }

  // action === 'newCat' ||  'newSubCat')
  else {
    // console.log('**************')
    // console.log(currentCategory)
    // console.log(action)
    handleCategoryActions(currentCategory, newCategoryName, action)
    return null
  }
}

export default InputCategoryChange
