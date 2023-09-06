import styles from './ASide.module.css'
import RootCatsList from '../content/RootCatsList'

function ASide() {
  return (
    <aside className={styles.aside}>
      <div>
        <RootCatsList />
      </div>
    </aside>
  )
}

export default ASide
