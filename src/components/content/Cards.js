import {useParams, useSearchParams} from 'react-router-dom'
import Card from './Card'
import {queryCategoryWithGoods, queryGoodsWithoutCats, goodWitoutCats} from '../../const'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import {actionPromise} from '../../store/PromiseReducer'
import {setContentHeaderText} from '../../store/HeaderTextReducer'
import {gqlFunc} from '../../utils'

function Cards() {
  //тянем параметры из url и ?
  const {id} = useParams()
  console.log(`id = ${typeof id} ${id}`)
  const [searchParams] = useSearchParams()
  const categoryName = searchParams.get('categoryName')

  //сетим  наш заголовок контента
  useEffect(() => {
    dispatch(setContentHeaderText(categoryName))
  }, [categoryName])

  // console.log(`id is ${id}`)
  // console.log(`categoryName is ${categoryName}`)

  const dispatch = useDispatch()
  const getGoods = useSelector(state => state.allGoods.getGoods)

  useEffect(() => {
    console.log(`id0 = ${id}`)
    if (id !== '0') {
      dispatch(actionPromise('getGoods', gqlFunc(queryCategoryWithGoods, {q: `[{"_id":"${id}"}]`})))
    } else {
      console.log(`с 0 категорий`)
      dispatch(actionPromise('getGoods', gqlFunc(queryGoodsWithoutCats, goodWitoutCats)))
    }
  }, [id])

  const {status, payload} = getGoods || {}

  return (
    <>
      {status === 'PENDING' || !status ? (
        <p>Loading...</p>
      ) : id !== '0' ? (
        payload &&
        payload.CategoryFindOne &&
        payload.CategoryFindOne.goods &&
        payload.CategoryFindOne.goods.length &&
        payload.CategoryFindOne.goods.map(good => (
          <Card
            key={good._id}
            categoryName={categoryName}
            categoryId={id}
            goodId={good._id}
            goodName={good.name}
            price={good.price}
            arrOfImages={good.images}
          />
        ))
      ) : (
        payload &&
        payload.GoodFind &&
        payload.GoodFind.length &&
        payload.GoodFind.map(good => (
          <Card
            key={good._id}
            categoryName={'без категории'}
            categoryId={0}
            goodId={good._id}
            goodName={good.name}
            price={good.price}
            arrOfImages={good.images}
          />
        ))
      )}
    </>
  )
}
export default Cards
