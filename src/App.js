import {BrowserRouter} from 'react-router-dom'
import './App.css'
// import {getBasketCounter} from './api'
import Logo from './components/header/Logo'
import MenuAndBasket from './components/header/MenuAndBasket'
import ASide from './components/main/ASide'
import Content from './components/main/Content'
// import ContentBody from './components/content/ContentBody'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <Logo />
          <MenuAndBasket />
        </header>

        <main>
          <ASide />
          <Content />
        </main>

        {/* <footer></footer> */}
      </div>
    </BrowserRouter>
  )
}

export default App
