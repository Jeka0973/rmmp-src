import {API_URL} from '../../const'
import {useState, useEffect} from 'react'
import {actionCartSub, actionCartAdd, actionCartSet, actionCartDel} from '../../store/CartReducer'
import {useDispatch} from 'react-redux'
import styles from './BasketItem.module.css'
import Button from '../UI/Button'

function BasketItem({currGood, count, setTrigger}) {
  let fullImageUrl

  if (currGood.images[0] != null && currGood.images[0] !== undefined) {
    fullImageUrl = `${API_URL}/${currGood.images[0].url}`
  } else {
    fullImageUrl = `${API_URL}/`
  }

  const [goodCount, setGoodCount] = useState(count)
  //количество текущего товара

  const [goodSumm, setGoodSum] = useState(currGood.price * count)

  const dispatch = useDispatch()

  useEffect(() => {
    setGoodSum(goodCount * currGood.price)
    setTrigger(() => Math.random())
    // setTrigger(() => Math.random() чтобы передавала всегда разные данные при изменении кол-ва товара и дергалась всегда, когда меняется кол-во товара!!
    // goodCount нельзя в триггер передавать!!
  }, [goodCount])

  const incCount = () => {
    dispatch(actionCartAdd(currGood))
    setGoodCount(() => goodCount + 1)
  }

  const decCount = () => {
    if (goodCount > 1) {
      dispatch(actionCartSub(currGood))
      setGoodCount(() => goodCount - 1)
    }
  }

  const setGoodsCount = count => {
    const countNumber = Number(count)
    if (!isNaN(countNumber) && countNumber > 0 && count % 1 === 0) {
      dispatch(actionCartSet(currGood, countNumber))
      setGoodCount(() => countNumber)
    } else {
      alert(`Количество должно быть целым числом, больше 1`)
    }
  }

  const delGood = () => {
    if (window.confirm('Вы действительно хотите удалить товар?')) {
      dispatch(actionCartDel(currGood))
      setGoodCount(() => 0)
    }
  }

  return (
    <div className={styles.rowOneGood}>
      <div>
        <img className={styles.goodPhoto} src={fullImageUrl} alt="image" />
      </div>
      <div className={styles.namePriceWrapper}>
        <div>
          <h2 className={styles.goodName}>{currGood.name}</h2>
        </div>
        <div>
          <p className={styles.goodPrice}>{currGood.price}&nbsp;₴</p>
        </div>
      </div>

      <div className={styles.buttonsWrapper}>
        <div>
          <Button text={'\u2212'} width="20px" height="20px" onClick={decCount} />
        </div>
        <div>
          <input
            type="text"
            className={styles.goodCount}
            size="2"
            value={goodCount}
            onChange={e => setGoodsCount(e.target.value)}
          />
        </div>
        <div>
          <Button text={'\u002B'} width="20px" height="20px" onClick={incCount} />
        </div>
      </div>
      <div>
        <p className={styles.goodSumm}>{goodSumm}&nbsp;₴</p>
      </div>
      <div>
        <Button text={'\u2715'} width="20px" height="20px" onClick={delGood} />
      </div>
    </div>
  )
}

export default BasketItem
