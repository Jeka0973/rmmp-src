import {Routes, Route, useParams} from 'react-router-dom'
// import {setText} from '../../store/HeaderTextReducer'
// import {useEffect} from 'react'
// import {useDispatch} from 'react-redux'
// import ContentHeader from './ContentHeader'
import Cards from './Cards'
import SelectedGoodCard from './SelectedGoodCard'
import Basket from './Basket'
import AutorizeForm from './AutorizeForm'
import OrderHistory from './OrderHistory'
// import RootCatsList from './RootCatsList'
import GoodEditForm from './GoodEditForm'
import {isAdmin} from '../../api'
import DefaultPage from '../main/DefaultPage'
import InputCategoryChange from './InputCategoryChange'

function ContentBody() {
  function InputCategoryChangeDecoration({data}) {
    const {categoryId, categoryName, parentId, action} = useParams()

    console.log(categoryId, categoryName, parentId, action)

    return (
      <InputCategoryChange
        currentCategory={{
          _id: categoryId,
          name: categoryName,
          parent: parentId,
        }}
        action={action}
      />
    )
  }

  return (
    <div className="contentBody">
      <Routes>
        <Route path="/" element={<DefaultPage />} /> //default
        <Route path="/category/:id" element={<Cards />} /> //категории с карточками товаров
        <Route //карточка выбранного товара
          path="/category/:categoryId/good/:goodId"
          element={<SelectedGoodCard />}
        />
        <Route //корзина
          path="/basket"
          element={<Basket />}
        />
        <Route //форма регистрации/логина
          path="/loginRegistryForm"
          element={<AutorizeForm />}
        />
        <Route //форма истории заказов
          path="/orderHistory"
          element={<OrderHistory />}
        />
        <Route //форма добавления товара
          path={isAdmin() ? '/goodAction/:action/category/:categoryId/:categoryName' : '/'}
          element={<GoodEditForm />}
        />
        <Route //форма добавления категории, подкатегории
          path={
            isAdmin()
              ? '/catAction/:action/category/:categoryId/:categoryName/parent/:parentId'
              : '/'
          }
          element={<InputCategoryChangeDecoration />}
        />
        <Route //форма редактирования товара
          path={
            isAdmin()
              ? '/goodAction/:action/category/:categoryId/:categoryName/goodId/:goodId'
              : '/'
          }
          element={<GoodEditForm />}
        />
      </Routes>
    </div>
  )
}

export default ContentBody
