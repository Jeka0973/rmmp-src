import {useDispatch, useSelector} from 'react-redux'
import {actionPromise} from '../../store/PromiseReducer'
import {useNavigate} from 'react-router-dom'
// import {useState, useEffect} from 'react'
import styles from './Card.module.css'
import {gqlFunc} from '../../utils'
import {goodDelete, queryCategoryWithGoods} from '../../const'
import ButtonRef from '../UI/ButtonRef'
import {API_URL} from '../../const'
import {isAdmin} from '../../api'
import Button from '../UI/Button'

function Card({categoryName, categoryId, goodId, goodName, price, arrOfImages}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  let img
  if (arrOfImages != null && arrOfImages.length > 0 && arrOfImages[0].url !== undefined) {
    img = `${API_URL}/${arrOfImages[0].url}`
  } else {
    img = `${API_URL}/`
  }

  const urlStr = `/category/${categoryId}/good/${goodId}?categoryName=${encodeURIComponent(
    categoryName
  )}&goodName=${encodeURIComponent(goodName)}`

  const handleDelete = async () => {
    if (window.confirm(`Вы действительно хотите удалить товар ${goodName}?`)) {
      await dispatch(actionPromise('getGoods', gqlFunc(goodDelete, {goodDelete: {_id: goodId}})))
      await dispatch(
        actionPromise('getGoods', gqlFunc(queryCategoryWithGoods, {q: `[{"_id":"${categoryId}"}]`}))
      )
    }
  }

  const handleEdit = async () => {
    await dispatch(
      actionPromise('getGoods', gqlFunc(queryCategoryWithGoods, {q: `[{"_id":"${categoryId}"}]`}))
    )
    navigate(`/goodAction/editGood/category/${categoryId}/${categoryName}/goodId/${goodId}`)
  }

  return (
    <div className={styles.card}>
      <div>
        <img className={styles.goodPhoto} src={img} />
      </div>
      <div>
        <h2>{goodName}</h2>
      </div>

      <div>
        <p>{price}&nbsp;₴</p>
      </div>

      <div>
        <ButtonRef text="Подробно" urlStr={urlStr} />
        {isAdmin() && (
          <>
            <Button
              text={'Удалить'}
              width="100px"
              height="20px"
              color="red"
              margin-bottom="5px"
              background="yellow"
              onClick={handleDelete}
            />
            <Button
              text={'Редактировать'}
              width="100px"
              height="20px"
              color="red"
              background="yellow"
              onClick={handleEdit}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default Card
