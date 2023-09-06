import styles from './MenuAndBasket.module.css'
import Button from '../UI/Button'
import basket from '../../img/basket.png'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {actionAuthLogout} from '../../store/AuthReducer'
import {Link} from 'react-router-dom'
import {getBasketCounter, getUserName} from '../../api'
import {isAdmin} from '../../api'

function MenuAndBasket() {
  const loggedUser = getUserName(useSelector(state => state.auth))
  const basketCounter = getBasketCounter(useSelector(state => state.busk))

  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className={styles.menuAndBasket}>
      <div className={styles.headerItems}>
        <ul>
          <li>{!loggedUser && <Link to="/loginRegistryForm">Авторизация</Link>}</li>
          <li>{loggedUser && <Link to="/orderHistory">История заказов</Link>}</li>
        </ul>
      </div>
      <div className={styles.userButtonWrapper}>
        <span className={isAdmin() ? styles.currAdmin : styles.currUser}>{loggedUser}</span>
        {loggedUser && (
          <Button
            text="Выйти"
            width="60px"
            height="20px"
            onClick={() => {
              dispatch(actionAuthLogout())
              navigate(`/`)
              window.location.reload()
            }}
          />
        )}
      </div>
      <Link to="/basket">
        <img className={styles.basketIco} src={basket} alt="basket" />
      </Link>
      <span className={styles.goodsCounter}>{basketCounter}</span>
    </div>
  )
}

export default MenuAndBasket
