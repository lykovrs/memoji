function memoji(
  rootElement,
  timerElement,
  classCard,
  openCardClass,
  timeRound,
) {
  var emojies = [
    { icon: "🦀", ready: false, id: 1 },
    { icon: "🦀", ready: false, id: 2 },
    { icon: "🐟", ready: false, id: 3 },
    { icon: "🐟", ready: false, id: 4 },
    { icon: "🐊", ready: false, id: 5 },
    { icon: "🐊", ready: false, id: 6 },
    { icon: "🐓", ready: false, id: 7 },
    { icon: "🐓", ready: false, id: 8 },
    { icon: "🦃", ready: false, id: 9 },
    { icon: "🦃", ready: false, id: 10 },
    { icon: "🐿", ready: false, id: 11 },
    { icon: "🐿", ready: false, id: 12 },
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
    newItem.dataset.emoji = item.icon;
    newItem.dataset.emojiId = item.id;
    rootElement.appendChild(newItem);
  });
  var prevControl = element;
  // делегируем клик
  rootElement.addEventListener("click", function(ev) {
    var control = ev.target;

    // выбираем только целевый элементы-карточки
    if ("card" in control.dataset) {
      var currentId = control.dataset.emojiId;
      var currentIcon = control.dataset.emoji;
      var prevId = prevControl.dataset.emojiId;
      var prevIcon = prevControl.dataset.emoji;

      // если пара уже открыт пропускаем
      if ("ready" in control.dataset) return;

      // обрабатываем клик по одной и той же карточке
      if (prevId === currentId) return;

      // клик по разным карточкам с разнымим иконками
      if (currentIcon !== prevIcon) {
        cardClose(prevControl, openCardClass);
        cardOpen(control, openCardClass);
      }

      // клик по разным карточкам с одинаковой иконкой
      if (currentIcon === prevIcon) {
        cardOpen(control, openCardClass);
        control.dataset.ready = true;
        prevControl.dataset.ready = true;
        prevControl = element;
        return;
      }

      console.log("result", calculateResult(emojies));
      prevControl = control;
      // cardOpen(control, openCardClass)
    }
  });

  // начинаем отсчет раунда игры
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

  function cardOpen(card, openCardClass) {
    card.classList.add(openCardClass);
  }

  function cardClose(card, openCardClass) {
    card.classList.remove(openCardClass);
  }

  // function makeMove(prevId, currentId) {
  //
  // }

  function calculateResult(arr) {
    return arr.every(function(item) {
      return item.ready;
    });
  }
}
