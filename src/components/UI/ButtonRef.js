import {Link} from 'react-router-dom'
import styles from './ButtonRef.module.css'

function ButtonRef({text, urlStr}) {
  // console.log(`text=${text} urlStr=${urlStr}`)

  return (
    <div>
      <Link to={urlStr} className={styles.buttonRef}>
        &nbsp;{text}&nbsp;
      </Link>
    </div>
  )
}
export default ButtonRef
