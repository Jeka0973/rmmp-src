import {useParams, useSearchParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import {actionPromise} from '../../store/PromiseReducer'
import {actionCartAdd} from '../../store/CartReducer'
import {setContentHeaderText} from '../../store/HeaderTextReducer'
import {gqlFunc} from '../../utils'
import {queryGood} from '../../const'
import styles from './SelectedGoodCard.module.css'
import Button from '../UI/Button'
import GoodsSlider from '../../utils/GoodsSlider'

function SelectedGoodCard() {
  const urlStr = `/basket`
  const dispatch = useDispatch()
  const {categoryId, goodId} = useParams()

  const [searchParams] = useSearchParams() //параметры запросов из текущего URL
  const categoryName = searchParams.get('categoryName')
  // console.log([searchParams])
  // console.log(categoryName)

  //сетим  наш заголовок контента
  useEffect(() => {
    dispatch(setContentHeaderText(categoryName))
  }, [categoryName])
  // console.log(`categoryId=${categoryId} goodId=${goodId}`)

  const getOneGood = useSelector(state => state.allGoods.getOneGood)

  useEffect(() => {
    dispatch(actionPromise('getOneGood', gqlFunc(queryGood, {q: `[{"_id":"${goodId}"}]`})))
  }, [])
  // console.log(payload.GoodFindOne)
  // console.log(getOneGood)
  const {status, payload} = getOneGood || {}
  // console.log(payload, status)

  // // const {_id, name, description, price} = payload.GoodFindOne
  let good = payload?.GoodFindOne
  //добавление в корзину

  return (
    <>
      {status === 'PENDING' || !status ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.oneGood}>
          <div>
            {good && good.images ? (
              <GoodsSlider imagesUrls={good.images} />
            ) : (
              <p>Нет изображений</p>
            )}
          </div>
          <div>
            {good && good.name ? (
              <h2 className={styles.goodName}>{good.name}</h2>
            ) : (
              <h2>Нет данных</h2>
            )}
            {/* <h2 className={styles.goodName}>{good.name ? good.name : 'Нет данных'}</h2> */}
          </div>
          <div>
            {good && good.name ? (
              <h2 className={styles.descr}>{good.description}</h2>
            ) : (
              <h2>Нет данных</h2>
            )}

            {/* <p className={styles.descr}>{good.description ? good.description : 'Нет данных'}</p> */}
          </div>
          <div>
            {good && good.price ? (
              <h2 className={styles.goodPrice}>{good.price}</h2>
            ) : (
              <h2>Нет данных</h2>
            )}

            {/* <p className={styles.goodPrice}>{good.price ? good.price : 'Нет данных'}&nbsp;₴</p> */}
          </div>

          <div className={styles.goodSale}>
            <Button text={'В корзину'} onClick={() => dispatch(actionCartAdd(good))} />
          </div>
        </div>
      )}
    </>
  )
}

export default SelectedGoodCard
