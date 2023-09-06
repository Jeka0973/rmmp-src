import logo from '../../img/logo.png'

function Logo() {
  return (
    <div className="headerLogo">
      <img src={logo} alt="Logo" />
      <div>
        <span className="headerText">MMP</span>
      </div>
    </div>
  )
}
export default Logo
