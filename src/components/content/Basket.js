import styles from './Basket.module.css'
import Button from '../UI/Button'
import {setContentHeaderText} from '../../store/HeaderTextReducer'
import {useDispatch} from 'react-redux'
import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {getUserName} from '../../api'
import BasketItem from './BasketItem'
import {gqlFunc} from '../../utils'
import {orderUpsert} from '../../const'
import {actionCartClear} from '../../store/CartReducer'
import {actionPromise} from '../../store/PromiseReducer'

function Basket() {
  const loggedUser = getUserName(useSelector(state => state.auth))
  // console.log(`loggedUser = ${loggedUser}`)
  const basketGoods = JSON.parse(localStorage.basket)

  const [totalSumm, setTotalSumm] = useState(0)
  const [countChangeTrigger, setCountChangeTrigger] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setContentHeaderText('Корзина'))
  }, [])

  //закидываем заказ и потом очищаем корзину
  const setOrder = () => {
    const objBasket = JSON.parse(localStorage.getItem('basket'))
    const goodsToOrder = Object.values(objBasket).map(item => ({
      count: item.count,
      good: {_id: item.good._id},
    }))

    if (dispatch(actionPromise('getOrder', gqlFunc(orderUpsert, {goods: goodsToOrder})))) {
      dispatch(actionCartClear())
      alert(`Data loaded, basket cleared`)
      setCountChangeTrigger(() => Math.random()) //чтобы дернуть обновление общей суммы и также обновляется BasketItem! (интересный момент вызова перерисовки BasketItem)
    } else {
      alert(`Error loading order data`)
    }
  }

  useEffect(() => {
    let summ = 0
    Object.keys(basketGoods).map(key => {
      summ = summ + basketGoods[key].good.price * basketGoods[key].count
    })
    setTotalSumm(summ)
  }, [countChangeTrigger])

  return (
    <div className={styles.basket}>
      {Object.keys(basketGoods).map(key => {
        return (
          <BasketItem
            key={basketGoods[key].good._id}
            currGood={basketGoods[key].good}
            count={basketGoods[key].count}
            setTrigger={setCountChangeTrigger}
          />
        )
      })}
      <div>
        {totalSumm ? (
          <p className={styles.totalSumm}>Итого:&nbsp;{totalSumm}&nbsp;₴</p>
        ) : (
          <h2>Корзина пустая!</h2>
        )}
      </div>
      <div>
        {totalSumm ? (
          <Button text={'Оформить заказ'} disabled={!loggedUser} onClick={setOrder} />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default Basket
