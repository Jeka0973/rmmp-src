// import {useEffect} from 'react'
import styles from './OrderItem.module.css'

function OrderItem({allGoods}) {
  return (
    <div>
      <table className={styles.orderTable}>
        <tr>
          <th>наименование</th>
          <th>Кол-во</th>
          <th>Цена за ед. ₴</th>
          <th>Сумма ₴</th>
        </tr>
        {allGoods !== null && allGoods.length ? (
          allGoods.map(item => (
            <tr>
              <td>{item.good !== null ? item.good.name : 'Пусто'}</td>
              <td>{item.count}</td>
              <td>{item.good !== null ? item.good.price : 'Пусто'}</td>

              <td>{item.good !== null ? +(item.good.price * item.count).toFixed(2) : 'Пусто'}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">Товаров нет</td>
          </tr>
        )}
      </table>
    </div>
  )
}
export default OrderItem

//для отладки
// for (let obj of arrOrdersHistory) {
//   console.log(`***********************************`)
//   // console.log(`orders: ${JSON.stringify(obj)}`)
//   console.log(`order id: ${obj._id}`)
//   console.log(`Created at: ${getFormatedDate(+obj.createdAt)}`)
//   let allGoods = obj.orderGoods
//   //console.log(`Goods: ${JSON.stringify(allGoods)}`)
//   for (let key in allGoods) {
//     console.log(`Count of curr good: ${allGoods[key].count}`)
//     let currGood = allGoods[key].good
//     console.log(`Good name:  ${currGood.name}`)
//     console.log(`Good price:  ${currGood.price}`)
//   }
// }
//для отладки
