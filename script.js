function memoji(rootElement, timerElement, classCard, openCardClass, timeRound) {
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
  // Счетчик времени игры
  var timeCounter = 0;
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

  tick(
    function() {
      renderTime(timerElement, timeCounter);
    },
    function() {
      console.log("ready!!!");
    },
    timeRound,
  );

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

  /**
   * Вызывает колбек каждую секунду
   * @param iterationCallback колбек на кждую итерацию
   * @param readyCallback колбек вызываемый после последней итерации
   * @param iterations колличество итераций вызова
   */
  function tick(iterationCallback, readyCallback, iterations) {
    setTimeout(function() {
      timeCounter += 1;
      iterationCallback();
      if (timeCounter <= iterations)
        tick(iterationCallback, readyCallback, iterations);
      else readyCallback();
    }, 1000);
  }

  function renderTime(element, time) {
    element.innerHTML = "00-" + (+time < 10 ? "0" + time : time);
  }
}
