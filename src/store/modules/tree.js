import treeApi from '@/api/tree'
//Объявление state для хранения данных полученных с сервера
const state = {
  data: null,
  isLoading: false,
  error: null,
  changeInProgress: [],
  createError: null,
  deleteError: null,
}
//Обращение к мутациям и экшенам через типы для удобства отладки исключения ошибки
export const mutationTypes = {
  getTreeStart: '[tree] getTreeStart',
  getTreeSuccess: '[tree] getTreeSuccess',
  getTreeFailure: '[tree] getTreeFailure',
  changeBrandStart: '[tree] changeBrandStart',
  changeBrandSuccess: '[tree] changeBrandSuccess',
  changeBrandFailure: '[tree] changeBrandFailure',
  createBrandSuccess: '[tree] createBrandSuccess',
  createBrandFailure: '[tree] createBrandFailure',
  deleteBrandSuccess: '[tree] deleteBrandSuccess',
  deleteBrandFailure: '[tree] deleteBrandFailure',
}

export const actionTypes = {
  getTree: '[tree] getTree',
  changeBrand: '[tree] changeBrand',
  createBrand: '[tree] createBrand',
  deleteBrand: '[tree] deleteBrand',
  refreshBrand: '[tree] refreshBrand',
}

const mutations = {
  [mutationTypes.getTreeStart](state) {
    state.isLoading = true
    state.data = null
  },
  [mutationTypes.getTreeSuccess](state, payload) {
    state.isLoading = false
    state.data = payload
  },
  [mutationTypes.getTreeFailure](state) {
    state.isLoading = false
  },
  [mutationTypes.changeBrandStart](state, id) {
    state.changeInProgress = [...state.changeInProgress, id]
  },
  [mutationTypes.changeBrandSuccess](state, payload) {
    state.changeInProgress.filter((id) => id !== payload._id)
    state.data = state.data.map((brand) => {
      if (brand._id === payload._id) {
        return { _id: brand._id, main: payload.main, title: payload.title }
      }
      return brand
    })
  },
  [mutationTypes.changeBrandFailure](state, error) {
    state.isLoading = false
    state.error = error
  },
  [mutationTypes.createBrandSuccess](state, payload) {
    state.createError = ''
    state.data = [...state.data, payload]
  },
  [mutationTypes.createBrandFailure](state, error) {
    state.isLoading = false
    state.createError = error
  },
  [mutationTypes.deleteBrandSuccess](state) {
    state.deleteError = ''
  },
  [mutationTypes.deleteBrandFailure](state, error) {
    state.isLoading = false
    state.createError = error
  },
}
//Обращения из компонентов к обработанным данным
const getters = {
  //Сортировка по алфавиту вне зависимости от регистра.
  // Slice() для создания копии массива
  sortedBrandsAbc: (state) => {
    const sorted = state.data.slice().sort((a, b) => {
      if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
      else if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
      else return 0
    })
    return sorted
  },
  //Создание массива с подмассивами объектов,
  // поля title которых начинаются на одинаковые символы
  splittedBrands: (state, getters) => {
    const arr = getters.sortedBrandsAbc
    const splitter = (arr, initialSplitArr = []) => {
      // Массив массивов
      let splitArr = initialSplitArr
      if (arr.length === 1) {
        //Условие заверщения рекурсии: входной массив длинной 1 или 0
        // 1 пушится в splitArr, 0 возвращает null
        splitArr.push(arr)
        return splitArr
      } else if (arr.length === 0) return null
      else {
        //Фильтр всех объектов по 1му символу элемента title
        const currentArr = arr.filter(
          (el) => el.title[0].toLowerCase() === arr[0].title[0].toLowerCase()
        )
        //Пуш отфильтрованного массива в splitArr
        splitArr.push(currentArr)
        //Запуск следующей итерации
        splitter(arr.slice(currentArr.length), splitArr)
      }
      return splitArr
    }
    return splitter(arr)
  },
  //Для корневых элементов tree:
  arrTitles: (state, getters) => {
    return getters.sortedBrandsAbc.map((el) => {
      return { ...el, title: el.title.slice(0, 1) }
    })
  },
  //Фильтр корневых элементов tree. Избавление от повторяющихся
  filterTitles: (state, getters) => {
    const getArrTitles = getters.arrTitles
    const filtrArr = (arr, accumUniq = []) => {
      //Условие выхода из рекурсии:
      if (arr.length < 1) return accumUniq
      //Инициализация accumUniq для первой итерации
      if (accumUniq.length < 1) accumUniq.push(arr[0])
      //Фильтр. Если в 0 элементе массива accumUniq есть такое значение,
      //то начинается след. итерация
      if (
        arr[0].title.toLowerCase() ===
        accumUniq[accumUniq.length - 1].title.toLowerCase()
      ) {
        filtrArr(arr.slice(1), accumUniq)
      } else {
        //Если такого значения нет, то пуш в accumUniq
        accumUniq.push(arr[0])
        filtrArr(arr.slice(1), accumUniq)
        //Накопленные уникальные значения title входного массива
        return accumUniq
      }
      return accumUniq
    }
    return filtrArr(getArrTitles)
  },
  sortMain: () => (arrayBrand) => {
    return arrayBrand.sort((a, b) => a.main - b.main)
  },
}
//Side effects
const actions = {
  [actionTypes.getTree](context) {
    return new Promise((resolve) => {
      context.commit(mutationTypes.getTreeStart)
      treeApi
        .getBrands()
        .then((response) => {
          context.commit(mutationTypes.getTreeSuccess, response.data)
          resolve(response.data)
        })
        .catch(() => {
          context.commit(mutationTypes.getTreeFailure)
        })
    })
  },
  [actionTypes.changeBrand](context, newData) {
    return new Promise((resolve) => {
      treeApi
        .changeBrand(newData)
        .then((response) => {
          context.commit(mutationTypes.createBrandSuccess, response.data)
          resolve(response.data)
        })
        .catch((result) => {
          context.commit(mutationTypes.changeBrandFailure, result.response.data)
        })
    })
  },
  [actionTypes.createBrand](context, newData) {
    return new Promise((resolve) => {
      treeApi
        .createBrand(newData)
        .then((response) => {
          context.commit(mutationTypes.createBrandSuccess, response.data)
          resolve(response.data)
        })
        .catch((result) => {
          context.commit(mutationTypes.createBrandFailure, result.response.data)
        })
    })
  },
  [actionTypes.deleteBrand](context, id) {
    return new Promise(() => {
      treeApi
        .deleteBrand(id)
        .then(() => {
          context.commit(mutationTypes.deleteBrandSuccess)
          context.dispatch(actionTypes.getTree)
        })
        .catch((result) => {
          context.commit(mutationTypes.deleteBrandFailure, result.response.data)
        })
    })
  },
}

export default {
  state,
  actions,
  mutations,
  getters,
}
