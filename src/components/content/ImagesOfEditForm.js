import styles from './ImagesOfEditForm.module.css'
import {API_URL} from '../../const'

function ImagesOfEditForm({url, id, arrOfGoodImagesId}) {
  return (
    <>
      <tr>
        <td className={styles.tdImage}>
          <div className={styles.imagesContainer}>
            <img src={`${API_URL}/${url}`} alt={`Изображение ${id}`} />
          </div>
        </td>
        <td>
          <div>
            <h5>удалить</h5>
            <input type="checkbox" onClick={e => arrOfGoodImagesId(id, e.target.checked)} />
          </div>
        </td>
      </tr>
    </>
  )
}

export default ImagesOfEditForm
