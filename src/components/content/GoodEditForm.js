import styles from './GoodEditForm.module.css'
import {useParams, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import {setContentHeaderText} from '../../store/HeaderTextReducer'
import {actionPromise} from '../../store/PromiseReducer'
import {gqlFunc} from '../../utils'
import {goodUpsert, queryGood, queryCategoryWithGoods} from '../../const'
import Button from '../UI/Button'
import ImagesOfEditForm from './ImagesOfEditForm'
import FileUploader from '../../utils/FileUploader'
import {getCatsTree} from '../../api'

function GoodEditForm() {
  const {action, categoryId, categoryName, goodId = ''} = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  //*************
  // console.log(`action = ${action}
  //   categoryId = ${categoryId}
  //   categoryName = ${categoryName}
  //   `)

  //*************

  const getAllCategories = useSelector(state => state.allGoods.getAllCategories)
  let actionTodo = ''
  action === 'newGood' ? (actionTodo = 'добавить') : (actionTodo = 'редактировать')

  const [catName, setCatName] = useState(categoryName)
  const [catId, setCatId] = useState(categoryId)
  const [id, setId] = useState(goodId)
  const [name, setName] = useState('')
  const [descr, setDescr] = useState('')
  const [price, setPrice] = useState('')
  const [imagesId, setImagesId] = useState([])
  const [images, setImages] = useState([])

  // useState для дерева категорий
  const [checkedCategories, setCheckedCategories] = useState([])
  //   {id: '64e3a10f6ad1742358af0080', isChecked: true}, //test2
  //   {id: '62d40377b74e1f5f2ec1a129', isChecked: true}, //sale
  // ])
  const [selectedCatsId, setSelectedCatsId] = useState([])
  const [categoryTree, setCategoryTree] = useState([])

  useEffect(() => {
    const catsTree = getCatsTree(getAllCategories?.payload?.CategoryFind || [])
    setCategoryTree(catsTree)
  }, [getAllCategories])

  const arrOfGoodImagesId = (id, isChecked) => {
    setImagesId(arr => {
      if (isChecked) {
        return arr.filter(image => image._id !== id)
      } else {
        const image = images.find(image => image._id === id)
        return image ? [...arr, {_id: image._id}] : arr
      }
    })
  }

  const getOneGood = useSelector(state => state.allGoods.getOneGood)

  useEffect(() => {
    if (id) {
      dispatch(actionPromise('getOneGood', gqlFunc(queryGood, {q: `[{"_id":"${id}"}]`})))
    } else {
    }
  }, [])

  const {status: statusGood, payload: payloadGood} = getOneGood || {}

  //вычитываем данные для редактирования в форму(сетим useState-ы)
  useEffect(() => {
    if (payloadGood && payloadGood.GoodFindOne && action !== 'newGood') {
      const good = payloadGood.GoodFindOne

      if (good.categories != null) {
        const checkedObjCats = good.categories.map(obj => ({id: obj._id, isChecked: true}))
        setCheckedCategories(checkedObjCats)
        setSelectedCatsId(checkedObjCats.filter(cat => cat.isChecked).map(cat => cat.id))
      }

      if (good.name != null) setName(good.name)
      if (good.description != null) setDescr(good.description)
      if (good.price != null) setPrice(good.price)
      if (good.images != null) {
        setImagesId(good.images.map(obj => ({_id: obj._id})))
        setImages(good.images)
      }
      setId(good._id)
    } else {
      setName('')
      setDescr('')
      setPrice('')
      setImagesId([])
      setImages([])
      setSelectedCatsId([categoryId])
      setCheckedCategories([{id: categoryId, isChecked: true}])
    }
  }, [getOneGood, action])

  //сетим  наш заголовок контента
  useEffect(() => {
    dispatch(setContentHeaderText(action === 'newGood' ? 'Добавить товар' : 'Редактировать товар'))
  }, [action])

  const handleGoodName = e => {
    setName(e.target.value)
  }

  const handleGoodDescr = e => {
    setDescr(e.target.value)
  }
  const handleGoodPrice = e => {
    setPrice(e.target.value)
  }

  //рендер дерева категорий с чекбоксами!
  const renderCats = arrOfCats => {
    const renderCategories = []

    const handleChange = (id, isChecked) => {
      const newCheckedCategories = [
        ...checkedCategories.filter(cat => cat.id !== id),
        {id, isChecked},
      ]
      //   //удаление старой,
      //   //иначе выходит что при unheck удаляется запись с isChecked==false но пр этом старое true значение id остается!!!

      //   // фильтруем по true и фрмируем безобъектный массив только по id
      const arrCatsIds = newCheckedCategories.filter(cat => cat.isChecked).map(cat => cat.id)
      setSelectedCatsId(arrCatsIds)

      setCheckedCategories(newCheckedCategories)

      console.log('*********** handleChange *********************')
      console.log('New selected cat IDs:', arrCatsIds)
      console.log(`isChecked =${isChecked}`)
      console.log(checkedCategories)
    }

    for (let i = 0; i < arrOfCats.length; i++) {
      renderCategories.push(
        <li className={styles.liTree} key={arrOfCats[i]._id}>
          <>
            <input
              type="checkbox"
              onChange={e => handleChange(arrOfCats[i]._id, e.target.checked)}
              checked={checkedCategories.some(cat => cat.id === arrOfCats[i]._id && cat.isChecked)}
              //при загрузке дерева отмечаем те категории, которые check == true т.е. принадлежит товар к этим категориям
            />{' '}
            {arrOfCats[i].name}
          </>
          {arrOfCats[i].child && arrOfCats[i].child.length > 0 && (
            <>{renderCats(arrOfCats[i].child)}</>
          )}
        </li>
      )
    }
    return <ul className={styles.ulTree}>{renderCategories}</ul>
  }

  //поля для всей формы
  const goodFields = (action, goodId = '', goodName, goodDescr, goodPrice, goodImagesId) => {
    //новый товар
    let goodFields = {
      name: goodName,
      description: goodDescr,
      price: parseFloat(goodPrice),
      images: goodImagesId,
      categories: selectedCatsId.map(id => ({_id: id})),
    }
    //при редактировании передаем id
    if (action !== 'newGood') {
      goodFields = {
        ...goodFields,
        _id: goodId,
      }
    }
    return goodFields
  }

  return (
    <div className={styles.editForm}>
      <div className={styles.category}>
        <h2>Категория</h2>
        {renderCats(categoryTree)}
      </div>
      <div>
        <h2>Изображения</h2>
      </div>
      <div className={styles.goodImageSection}>
        <div>
          <FileUploader setImages={setImages} setImagesId={setImagesId} />
        </div>
        <div className={styles.imagesBox}>
          <table>
            <tbody>
              {images.map(img => (
                <ImagesOfEditForm
                  key={img._id}
                  url={img.url}
                  id={img._id}
                  arrOfGoodImagesId={arrOfGoodImagesId}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.goodName}>
        <h2>Имя товара</h2>
        <textarea value={name} onChange={handleGoodName}></textarea>
      </div>
      <div className={styles.goodDescr}>
        <h2>Описание</h2>
        <textarea value={descr} onChange={handleGoodDescr}></textarea>
      </div>
      <div className={styles.goodPrice}>
        <h2>Цена</h2>
        <input type="number" min="0" step="1.00" value={price} onChange={handleGoodPrice}></input>
      </div>
      <div className={styles.applyButton}>
        <Button
          text={action === 'newGood' ? 'Добавить' : 'Применить'}
          onClick={async () => {
            if (
              window.confirm(`Вы действительно хотите ${actionTodo} товар в категории ${catName}?`)
            ) {
              // console.log(goodFields(action, id, name, descr, price, imagesId))
              // console.log(`id = ${id}  `)

              // console.log(getOneGood)
              await dispatch(
                actionPromise(
                  'getOneGood',
                  gqlFunc(goodUpsert, {
                    goodEdit: goodFields(action, id, name, descr, price, imagesId),
                  })
                )
              )
              await dispatch(
                actionPromise(
                  'getGoods',
                  gqlFunc(queryCategoryWithGoods, {q: `[{"_id":"${catId}"}]`})
                )
              )

              navigate(`/category/${categoryId}?categoryName=${catName}`)
            }
          }}
        />
      </div>
    </div>
  )
}

export default GoodEditForm
