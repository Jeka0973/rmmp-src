import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {loginQuery, registrationQuery} from '../../const'
import {useNavigate} from 'react-router-dom'
import styles from './AutorizeForm.module.css'
import Button from '../UI/Button'
import {gqlFunc} from '../../utils'
import {actionAuthLogin} from '../../store/AuthReducer'
import {setContentHeaderText} from '../../store/HeaderTextReducer'

function AutorizeForm() {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [inputType, setInputType] = useState('password')

  let isDisabledButton = username && password ? false : true
  console.log(`isDisabledButton=${isDisabledButton}`)

  const logOk = 'Login successful'
  const logFalse = 'User or password does not correct'
  const regOk = 'User created and logged!'
  const regFalse = 'User create error!'

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(setContentHeaderText('Авторизация'))
  }, [])

  const onCheckboxChange = e => {
    setIsChecked(e.target.checked)
    isChecked ? setInputType(() => 'password') : setInputType(() => 'text')
  }

  //логин
  const login = async (user, pwd, actOk, actFalse) => {
    const token = await gqlFunc(loginQuery, {
      login: user,
      password: pwd,
    })
    if (token.login) {
      dispatch(actionAuthLogin(token.login))
      setUserName(() => '')
      setPassword(() => '')
      alert(actOk)
    } else {
      alert(actFalse)
    }
    navigate(`/`)
    window.location.reload()
  }

  //регистрация
  const registration = async (user, pwd, actOk, actFalse) => {
    await gqlFunc(registrationQuery, {
      login: user,
      password: pwd,
    })
    login(user, pwd, actOk, actFalse)
  }

  return (
    <div className={styles.authForm}>
      <div>
        <div>
          <label for="loginInput">Login</label>
        </div>
        <div>
          <input
            type="text"
            value={username}
            onChange={e => setUserName(e.target.value)}
            className={styles.loginInput}
          />
        </div>
      </div>
      <div>
        <label for="pwdInput">Password</label>
        <input
          type={inputType}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={styles.pwdInput}
        />
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onCheckboxChange}
          className={styles.chkBoxPwd}
        />
      </div>
      <div className={styles.buttonsWrapper}>
        <>
          <Button
            text={'Логин'}
            disabled={isDisabledButton}
            onClick={() => login(username, password, logOk, logFalse)}
          />
          <Button
            text={'Регистрация'}
            disabled={isDisabledButton}
            onClick={() => registration(username, password, regOk, regFalse)}
          />
        </>
      </div>
    </div>
  )
}
export default AutorizeForm
