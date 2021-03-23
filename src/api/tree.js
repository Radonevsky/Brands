import axios from 'axios'

//Базовый URL
axios.defaults.baseURL = 'https://recruting-test-api.herokuapp.com/api/v1'

//Получение всех brands
const getBrands = () => {
  return axios.get('/brands')
}
//Change
const changeBrand = (newData) => {
  return axios.put(`/brand/${newData.id}`, {
    title: newData.title,
    main: newData.main,
  })
}
//Create
const createBrand = (newData) => {
  return axios.post(`/brands`, {
    title: newData.title,
    main: newData.main,
  })
}
//Delete
const deleteBrand = (id) => {
  return axios.delete(`/brand/${id}`)
}
export default {
  getBrands,
  changeBrand,
  createBrand,
  deleteBrand,
}
