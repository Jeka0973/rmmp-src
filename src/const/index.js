export const API_URL = 'http://shop-roles.node.ed.asmer.org.ua'
export const API_URL_GRAPHQL = `${API_URL}/graphql`

// const originalFetch = fetch
// fetch = (url, params = {headers: {}}) => {
//   params.headers.Authorization = 'Bearer ' + localStorage.authToken
//   return originalFetch(url, params)
// }

// ********************* Запрос на список корневых категорий ******************

//Используем CategoryFind, однако в параметре query используем поиск по полю parent, которое должно быть равно null. (у корневых категорий нет родителя)

export const rootCategories = {q: '[{"parent":null}]'}

export const queryRootCategories = `
  query rootCategories($q: String){ 
    CategoryFind(query: $q) {
      _id
      name
      subCategories {
        _id
        name
      }
    }
  }
  `

//получаем плоскую структуру всех сатегорий с подкатегориями

export const queryAllCategories = `
  query allCategories{ 
    CategoryFind(query:"[{}]") {
      _id
      name
  parent {
    _id
    name
      }
    }
  }
  `

//   Запрос для получения одной категории c с проверкой подкатегорий

// "q": "[{\"_id\": \"64174598d5e3301cba63a6a2\"}]"
//let idCategory = {q: '[{"_id":"64031651d5e3301cba63a54c"}]'}

export const querySubCategories = `
query subCategories($q: String) {
  CategoryFind(query: $q) {
    _id
    name
    subCategories {
      _id
      name
    }
  }
}
`

// *********************  Запрос для получения одной категории с товарами и картинками ******************
// Используем CategoryFindOne, передав _id. Попросите GraphQL прислать вам товары из этой категории, а так же подкатегории. Параметр: _id
//  "_id": "64031651d5e3301cba63a54c",
//  "name": "Food" -> пример категории с id
//let id = {id: '64031651d5e3301cba63a54c'} //передаем Food, как для примера

//let idCategory = {q: '[{"_id":"64031651d5e3301cba63a54c"}]'}

export const queryCategoryWithGoods = `
  query oneCatWithGoods($q: String){
    CategoryFindOne(query: $q){
        _id name subCategories {
          _id name
        }
         goods {
          _id name price images {
            url
          }

        }
    }
  }
  `
// *********************  Запрос на получение товара с описанием и картинками ******************
// Аналогично предыдущему запросу, но используем GoodFindOne, так же по _id. Параметр: _id
//_id: '64063ab9d5e3301cba63a5a2', name: 'Угорь Унаги Жареный'

// let idGood = {q: '[{"_id":"64063ab9d5e3301cba63a5a2"}]'} // -> потом передавать в idGood нужный id (64063ab9d5e3301cba63a5a2)

export const queryGood = `
query goodWithDescription ($q: String) {
  GoodFindOne (query: $q) {
    _id name description price images {
      url
      _id
    }
    categories {
      _id
    }
  }
}
`
// *********************  Запрос на получение товаров без категорий  *****

export const goodWitoutCats = {q: '[{"categories":[]}]'}

export const queryGoodsWithoutCats = `
query goodsWithoutCats ($q: String ){
  GoodFind (query: $q) {
    _id name price 
categories {
  _id
}
images {
      url
    }
  }
}
`

// *********************  Запрос на логин пользователя  *****
export const loginQuery = `query login($login:String, $password:String){
  login(login:$login, password:$password)}`

// *********************  Запрос на регистрацию пользователя  *****
export const registrationQuery = `
mutation reg($login: String, $password: String) {
       UserUpsert(user: { login: $login, password: $password }) {
         _id login createdAt
       }
     }`

//*********************  Запрос оформления заказа  *****

export const orderUpsert = `mutation order ($goods: [OrderGoodInput]) {
      OrderUpsert(order: { orderGoods: $goods }) {
        _id
        createdAt
        total
       }
    }
    `
//*********************  Запрос истории заказов  *****

export const orderFind = ` query orders ($q: String) {
  OrderFind (query: $q) {
    _id createdAt orderGoods{
       count good {
        name price
       }
    }
  }
}
`
//*********************  Запрос на редактирование - добавление категории

export const categoryUpsert = `mutation category ($categoryEdit: CategoryInput){
  CategoryUpsert(category: $categoryEdit)
 {
    _id
    name
  }
}
` // _id для редактирования
//   name: "Test123",
//   parent: null,
//   goods: [],
//   subCategories: []
// })

//**********  Запрос на удаление категории *******
export const categoryDelete = `mutation category ($categoryDelete: CategoryInput){
  CategoryDelete(category: $categoryDelete)
 {
    name
  }
}
`

//Запрос на редактирование - добавление товара в категорию

export const goodUpsert = `mutation good ($goodEdit : GoodInput) {
  GoodUpsert(good :$goodEdit ) {
    _id
    name
    description
    price 
    images {
      url
    }
    categories {
      _id
    }
  }
}
`
//Запрос на удаление товара в категорию
export const goodDelete = `mutation good ($goodDelete : GoodInput) {
  GoodDelete(good :$goodDelete )
   {
    name
  }
}
`

export const arrOfObjExampleForCatTree = [
  {
    _id: '6262ca7dbf8b206433f5b3d1',
    name: 'Tools',
    parent: null,
  },
  {
    _id: '62c94b10b74e1f5f2ec1a0dd',
    name: 'Smartphone',
    parent: null,
  },
  {
    _id: '62ce891eb74e1f5f2ec1a0eb',
    name: 'Garden',
    parent: null,
  },
  {
    _id: '62ce8a8fb74e1f5f2ec1a0ec',
    name: "Children's products",
    parent: null,
  },
  {
    _id: '62ce8b3db74e1f5f2ec1a0ed',
    name: 'Hobbies and sports',
    parent: null,
  },
  {
    _id: '62d40377b74e1f5f2ec1a129',
    name: 'Sale',
    parent: null,
  },
  {
    _id: '63da9bfdd5e3301cba63a2a7',
    name: 'TestCats',
    parent: null,
  },
  {
    _id: '63dd6537d5e3301cba63a345',
    name: 'Laptops',
    parent: null,
  },
  {
    _id: '64031651d5e3301cba63a54c',
    name: 'Food',
    parent: null,
  },
  {
    _id: '64031693d5e3301cba63a54d',
    name: 'Drinks',
    parent: null,
  },
  {
    _id: '64174598d5e3301cba63a6a2',
    name: 'Chinese tea',
    parent: {
      _id: '64031693d5e3301cba63a54d',
      name: 'Drinks',
    },
  },
  {
    _id: '641745a6d5e3301cba63a6a3',
    name: 'Teaware',
    parent: {
      _id: '64031693d5e3301cba63a54d',
      name: 'Drinks',
    },
  },
  {
    _id: '641772f4cf9ab52a4f5a660d',
    name: 'Books',
    parent: null,
  },
  {
    _id: '64187ea8cf9ab52a4f5a660e',
    name: 'Pets stuff',
    parent: null,
  },
  {
    _id: '64187ef8cf9ab52a4f5a660f',
    name: 'Furniture',
    parent: null,
  },
  {
    _id: '64256849265a3601c4be2a77',
    name: 'Test category',
    parent: {
      _id: '63da9bfdd5e3301cba63a2a7',
      name: 'TestCats',
    },
  },
  {
    _id: '64b7f9496ad1742358aefe34',
    name: 'Cherepashki',
    parent: null,
  },
  {
    _id: '64b7fe1b6ad1742358aefe3a',
    name: 'Snow133',
    parent: null,
  },
  {
    _id: '64d8d4bc6ad1742358af0062',
    name: 'Chinese tea Green Sub 2',
    parent: {
      _id: '64174598d5e3301cba63a6a2',
      name: 'Chinese tea',
    },
  },
  {
    _id: '64d8daf26ad1742358af0063',
    name: 'Chinese tea Green Sub Sub 3',
    parent: {
      _id: '64d8d4bc6ad1742358af0062',
      name: 'Chinese tea Green Sub 2',
    },
  },
]
