import {API_URL, API_URL_GRAPHQL} from '../const/index'

function getGQL(url) {
  return async function gql(query, variables = {}) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({query, variables}),
    }

    if (Object.keys(JSON.parse(localStorage.authToken)).length) {
      options.headers.Authorization = 'Bearer ' + JSON.parse(localStorage.authToken).token
      //alert(options.headers.Authorization)
    }
    //alert(JSON.parse(options))

    const response = await fetch(url, options)
    const data = await response.json()

    if (data.errors) {
      alert(data.errors[0].message)
      throw new Error(JSON.stringify(data.errors))
    }
    return Object.values(data)[0] //  gql был без лишних оберток, из data извлекается первое значение как бы не назывался ключ;
  }
}

export let gqlFunc = getGQL(API_URL_GRAPHQL)
