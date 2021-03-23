//Рекурсия для создания массива с массивами/объектами,
//все элементы которых начинаются на один и тот же символ.
// Для отсортированных по возрастанию/убыванию массивов
const splitter = (arr, initialSplitArr = []) => {
  debugger
  // Массив массивов
  let splitArr = initialSplitArr

  if (arr.length === 1) {
    //Условие заверщения рекурсии: входной массив длинной 1 или 0
    // 1 пушится в splitArr, 0 возвращает null
    splitArr.push(arr)
    return splitArr
  } else if (arr.length === 0) return null
  else {
    //Фильтр всех эл-в по 1му символу элемента title
    const currentArr = arr.filter((el) => el.title === arr[0].title)
    //Пуш отфильтрованного массива в splitArr
    splitArr.push(currentArr)
    //Объявление длины фильтрованного массива
    const sliceLength = currentArr.length
    //Запуск следующей итерации с входным параметром:
    //array без 0..sliceLength эл-ов
    splitter(arr.slice(sliceLength), splitArr)

  }
  return splitArr
}

export default splitter
