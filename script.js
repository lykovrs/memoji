function memoji(rootElement, classCard, openCardClass) {
  var emojies = [
    "🦀",
    "🐟",
    "🐊",
    "🐓",
    "🦃",
    "🐿",
    "🦀",
    "🐟",
    "🐊",
    "🐓",
    "🦃",
    "🐿",
  ];
  // Создаем случайную последовательность эмоджи
  emojies = shuffle(emojies);
  // Готовим заготовку карточки
  var element = document.createElement("article");
  element.dataset.card = "";
  element.classList.add(classCard);
  // Добавляем рандомную последовательность карточек на страницу
  emojies.forEach(function(item) {
    var newItem = element.cloneNode(false);
    newItem.dataset.emoji = item;
    rootElement.appendChild(newItem);
  });

  // делегируем клик
  rootElement.addEventListener("click", function(ev) {
    var control = ev.target;
    // выбираем только целевый элементы-карточки
    if ("card" in control.dataset) {
      console.log(ev.target);
      control.classList.toggle(openCardClass);
    }
  });

  /**
   * Функция перемешивания массива
   * @param array входной массив
   * @returns {*}
   */
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
