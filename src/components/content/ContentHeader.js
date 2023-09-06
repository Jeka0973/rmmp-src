import {useSelector} from 'react-redux'

function ContentHeader() {
  return (
    <div className="contentHeader">
      <span>{useSelector(state => state.contentHeader.text)}</span>
    </div>
  )
}
export default ContentHeader
