import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {gqlFunc} from '../../utils'
import {setContentHeaderText} from '../../store/HeaderTextReducer'
import {orderFind} from '../../const'
import {actionPromise} from '../../store/PromiseReducer'
import {getFormatedDate} from '../../api'
import styles from './OrderHistory.module.css'
import OrderItem from './OrderItem'

function OrderHistory() {
  const dispatch = useDispatch()

  //сетим  наш заголовок контента
  useEffect(() => {
    dispatch(setContentHeaderText('История заказов'))
  }, [])

  useEffect(() => {
    dispatch(actionPromise('getOrdersHistory', gqlFunc(orderFind, {q: '[{}]'})))
  }, [])

  const getOrdersHistory = useSelector(state => state.allGoods.getOrdersHistory)

  const {status, payload} = getOrdersHistory || {}

  const arrOrdersHistory = payload?.OrderFind

  const summGoodsInOneOrder = allGoods => {
    let summ = 0
    if (allGoods !== null && allGoods.length) {
      allGoods.forEach(item => {
        if (item.good !== null) {
          summ += +(item.good.price * item.count).toFixed(2)
        }
      })
    }
    return summ
  }
  return (
    <>
      {status === 'PENDING' || !status ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.ordersReport}>
          {arrOrdersHistory !== null && arrOrdersHistory.length ? (
            arrOrdersHistory.map(obj => (
              <div className={styles.oneOrder} key={obj._id}>
                <div>
                  <h2 className="orderNum">
                    Ордер № {obj._id} (от {getFormatedDate(+obj.createdAt)})
                  </h2>
                </div>
                <OrderItem allGoods={obj.orderGoods} />
                {/* // setSummOfGoods={setSummOfGoods} */}
                <div>
                  <p className={styles.sumOfOrder}>Итого:{summGoodsInOneOrder(obj.orderGoods)}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Пусто</p>
          )}
        </div>
      )}
    </>
  )
}

export default OrderHistory
