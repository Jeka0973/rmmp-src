import styles from './Button.module.css'

function Button({text, width = '120px', height = '30px', onClick, disabled = false, ...rest}) {
  //rest- всякие стили для "на ходу"

  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ''}`}
      style={{width, height, ...rest}}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}
export default Button
