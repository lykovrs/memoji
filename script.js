function memoji(
  rootElement,
  timerElement,
  classCard,
  openCardClass,
  timeRound,
) {
  var emojies = [
    { icon: "🦀", id: 1 },
    { icon: "🦀", id: 2 },
    { icon: "🐟", id: 3 },
    { icon: "🐟", id: 4 },
    { icon: "🐊", id: 5 },
    { icon: "🐊", id: 6 },
    { icon: "🐓", id: 7 },
    { icon: "🐓", id: 8 },
    { icon: "🦃", id: 9 },
    { icon: "🦃", id: 10 },
    { icon: "🐿", id: 11 },
    { icon: "🐿", id: 12 },
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
  var collection = emojies.map(function(item) {
    var newItem = element.cloneNode(false);
    newItem.dataset.emoji = item.icon;
    newItem.dataset.emojiId = item.id;
    rootElement.appendChild(newItem);
    return newItem;
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

        if (calculateResult(collection)) {
          showModal("win", restartSession);
        }

        return;
      }

      // сохраняем состояние
      prevControl = control;
    }
  });

  // начинаем отсчет раунда игры
  tick(
    function() {
      renderTime(timerElement, timeCounter);
    },
    function() {
      if (!calculateResult(collection)) {
        showModal("loose", restartSession);
      }
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

  /**
   * Отображает строку отсчета
   * @param element элемент, содержимое которого обновляем
   * @param time обновляемое значение
   */
  function renderTime(element, time) {
    element.innerHTML = "00-" + (+time < 10 ? "0" + time : time);
  }

  /**
   * Показывает карточку
   * @param card элемент карточки
   * @param openCardClass добавляемы класс
   */
  function cardOpen(card, openCardClass) {
    card.classList.add(openCardClass);
  }

  /**
   * Скрывает карточку
   * @param card элемент карточки
   * @param openCardClass удаляемый класс
   */
  function cardClose(card, openCardClass) {
    card.classList.remove(openCardClass);
  }

  /**
   * Делает подсчет результата
   * @param arr массив с дом-элементами
   * @returns {boolean} результат игры
   */
  function calculateResult(arr) {
    return arr.every(function(item) {
      return item.dataset.ready;
    });
  }

  /**
   * Поднимает модальное окно
   * @param text информирующий текст
   * @param callback колбек клика по кнопке
   */
  function showModal(text, callback) {
    var button = document.createElement("button");
    button.classList.add("modal__action");
    button.innerText = "Try again";
    button.addEventListener("click", function(ev) {
      ev.preventDefault();
      callback();
    });

    var message = document.createElement("h2");
    message.classList.add("modal__message");
    message.innerText = text;

    var container = document.createElement("article");
    container.classList.add("modal__container");

    container.appendChild(message);
    container.appendChild(button);

    var overlay = document.createElement("div");
    overlay.classList.add("modal");

    overlay.appendChild(container);
    document.body.appendChild(overlay);
  }

  /**
   * Запускает игру заново
   */
  function restartSession() {
    window.location.reload();
  }
}
