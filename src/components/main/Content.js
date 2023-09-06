import styles from './Content.module.css'
import ContentBody from '../content/ContentBody'
import ContentHeader from '../content/ContentHeader'

function Content() {
  return (
    <div className="content">
      <ContentHeader />
      <ContentBody />
    </div>
  )
}
export default Content
