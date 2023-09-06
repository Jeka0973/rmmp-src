import styles from './RootCatsList.module.css'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import {actionPromise} from '../../store/PromiseReducer'
import {gqlFunc} from '../../utils'
import {queryAllCategories} from '../../const/index'
import InputCategoryChange from './InputCategoryChange'
import {isAdmin} from '../../api'
import Button from '../UI/Button'
import {getCatsTree} from '../../api'
import TreeOfCats from '../../utils/TreeOfCats'

function RootCatsList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const getCategories = useSelector(state => state.allGoods.getCategories)
  const getAllCategories = useSelector(state => state.allGoods.getAllCategories)
  const [categoryTree, setCategoryTree] = useState([])

  //используем для обновления после удаления товара (изменение стейта)
  // const getGoods = useSelector(state => state.allGoods.getGoods)

  useEffect(() => {
    dispatch(actionPromise('getAllCategories', gqlFunc(queryAllCategories, {})))
  }, [])

  useEffect(() => {
    const catsTree = getCatsTree(getAllCategories?.payload?.CategoryFind || [])
    setCategoryTree(catsTree)
  }, [getAllCategories])

  // useEffect(() => {
  //   dispatch(
  //     actionPromise('getCategories', gqlFunc(categoryDelete, {categoryDelete: {_id: delCat}}))
  //   )
  // }, [delCat]) //

  // useEffect(() => {
  //   dispatch(actionPromise('getCategories', gqlFunc(queryRootCategories, rootCategories)))
  // }, [])

  // const handleCategoryDelete = async (name, id) => {
  //   if (window.confirm(`Вы действительно хотите удалить категорию ${name}?`)) {
  //     await dispatch(
  //       actionPromise('getCategories', gqlFunc(categoryDelete, {categoryDelete: {_id: id}}))
  //     )
  //     await dispatch(actionPromise('getAllCategories', gqlFunc(queryAllCategories, {})))
  //     // setDelCat(category._id)
  //   }
  // }

  const {status, payload} = getAllCategories || {}

  //______________________________________________________

  const [checkedCategories, setCheckedCategories] = useState([
    {id: '64e3a10f6ad1742358af0080', isChecked: true}, //test2
    {id: '62d40377b74e1f5f2ec1a129', isChecked: true}, //sale
  ])
  const [selectedCatsId, setSelectedCatsId] = useState([])

  const renderCats = arrOfCats => {
    const renderCategories = []

    const handleChange = (id, isChecked) => {
      const newCheckedCategories = [
        ...checkedCategories.filter(cat => cat.id !== id),
        {id, isChecked},
      ]
      //удаление старой,
      //иначе выходит что при unheck удаляется запись с isChecked==false но пр этом старое true значение id остается!!!

      // фильтруем по true и фрмируем безобъектный массив только по id
      const arrCatsIds = newCheckedCategories.filter(cat => cat.isChecked).map(cat => cat.id)
      setSelectedCatsId(arrCatsIds)

      setCheckedCategories(newCheckedCategories)
    }

    for (let i = 0; i < arrOfCats.length; i++) {
      renderCategories.push(
        <li key={arrOfCats[i]._id}>
          <>
            <input
              type="checkbox"
              onChange={e => handleChange(arrOfCats[i]._id, e.target.checked)}
              checked={checkedCategories.some(cat => cat.id === arrOfCats[i]._id && cat.isChecked)}
              //при загрузке дерева отмечаем те категории, которые check == true т.е. принадлежит товар к этим категориям
            />
            {arrOfCats[i].name}
          </>
          {arrOfCats[i].child && arrOfCats[i].child.length > 0 && (
            <>{renderCats(arrOfCats[i].child)}</>
          )}
        </li>
      )
    }
    return <ul>{renderCategories}</ul>
  }
  //______________________________________________________
  return (
    <>
      {isAdmin() ? (
        <div className={styles.newCatInput}>
          <Button
            text={'Товары без категорий'}
            width="180px"
            height="23px"
            border-radius="3px"
            onClick={() => {
              navigate(`/category/0?categoryName=${encodeURIComponent('Без категории')}`)
            }}
          />
          <p>Новая корневая категория</p>
          <InputCategoryChange currentCategory={''} action={'newRootCat'} />
          <p></p>
        </div>
      ) : null}
      {/* <ul className={styles.rootCats}> */}
      {status === 'PENDING' || !status ? (
        <p>Loading...</p>
      ) : (
        <div className="aside">
          <TreeOfCats data={categoryTree} />
        </div>
      )}
      {/* </ul> */}
    </>
  )
}

export default RootCatsList

// console.log(`***********`)

// for (let category of arrOfCats) {
//   console.log(category.child.length)
//   if (category.child.length == 0) {
//     console.log(category._id)
//     console.log(category.name)
//     category.parent === null ? console.log(`parent: null`) : console.log(category.parent)
//   } else {
//     // console.log(category.child)
//     renderCats(category.child)
//   }
// }

//....... <div className="aside">
//   {payload &&
//     payload.CategoryFind &&
//     payload.CategoryFind.length &&
//     payload.CategoryFind.map(category => (
// <li key={category._id}>
//   <Link
//     to={`/category/${category._id}?categoryName=${encodeURIComponent(
//       category.name
//     )}`}
//   >
//     {isAdmin() ? (
//       <InputCategoryChange currentCategory={category} />
//     ) : (
//       <>{category.name}</>
//     )}
//   </Link>
//   {isAdmin() && (
//     <>
//       <Button
//         text={'\u2715'}
//         width="18px"
//         height="18px"
//         onClick={() => handleCategoryDelete(category.name, category._id)}
//       />
//       <Button
//         text={'\u002B товар'}
//         width="55px"
//         height="18px"
//         onClick={() => {
//           navigate(`goodAction/newGood/category/${category._id}/${category.name}`)
//         }}
//       />
//     </>
//   )}
// </li>
//     ))}
// .....</div>

// const renderCats = arrOfCats => {
//   const renderCategories = []

//   for (const category of arrOfCats) {
//     renderCategories.push(
//       <li key={category._id}>
//         {/* <Link to={`/category/${category._id}?categoryName=${encodeURIComponent(category.name)}`}>
//           {isAdmin() ? <InputCategoryChange currentCategory={category} /> : <>{category.name}</>}
//         </Link> */}
//         <>{category.name}</>
//         {/* {isAdmin() && (
//           <>
//             <Button
//               text={'\u2715'}
//               width="18px"
//               height="18px"
//               onClick={() => handleCategoryDelete(category.name, category._id)}
//             />
//             <Button
//               text={'\u002B товар'}
//               width="55px"
//               height="18px"
//               onClick={() => {
//                 navigate(`goodAction/newGood/category/${category._id}/${category.name}`)
//               }}
//             />
//           </>
//         )} */}
//         {category.child && category.child.length > 0 && <ul>{renderCats(category.child)}</ul>}
//       </li>
//     )
//   }

//   return <ul>{renderCategories}</ul>
// }
