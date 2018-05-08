function Game(options) {
  // генерируем пары
  this._emojies = this.generateCouple(["🦀", "🐟", "🐊", "🐓", "🦃", "🐿"]);
  // Счетчик времени игры
  this._timeCounter = 0;
  // Перемешиваем массив
  this.mixCards(this._emojies);
  // Добавляем рандомную последовательность карточек на страницу
  this._collection = this._emojies.map(function(item) {
    var element = document.createElement("article");
    element.dataset.card = "";
    element.classList.add(options.classCard);
    element.dataset.emoji = item.icon;
    element.dataset.emojiId = item.id;
    options.rootElement.appendChild(element);
    return element;
  });
  // для принятия решения нужно знать хотябы последне три корректных хода
  this._history = {
    first: null,
    second: null,
    third: null,
  };

  // делегируем клик
  options.rootElement.addEventListener(
    "click",
    function(ev) {
      var history = this._history;
      // выбираем только целевый элементы-карточки
      if ("card" in ev.target.dataset) {
        var control = ev.target;
        var id = control.dataset.emojiId;

        // если карта отыграна, не  реагируем на клик
        if (control.classList.contains(options.roundSuccessClass)) return;

        // повторынй клик по одной из открытых карт
        if (control === history.first || control === history.second) {
          // закрываем крату
          this.cardClose(control, options.openCardClass);
          // обновляем очередь
          if (control === history.first) {
            // убираем подсветку первого кондрола
            history.first.classList.remove(options.roundErrorClass);

            if (history.second) {
              // убираем подсветку второго контрола
              history.second.classList.remove(options.roundErrorClass);
              history.first = history.second;
              history.second = null;
            } else {
              history.first = null;
            }
          }

          if (control === history.second) {
            // убираем подсветку
            history.first.classList.remove(options.roundErrorClass);
            history.second.classList.remove(options.roundErrorClass);
            history.second = null;
          }
          return;
        }

        // если очередь полна
        if (history.first && history.second) {
          // закрываем карточки, если проверка не пройдена и удаляем подсветку
          if (
            !this.calculateMove(
              history.first.dataset.emojiId,
              history.second.dataset.emojiId,
            )
          ) {
            history.first.classList.remove(options.roundErrorClass);
            history.second.classList.remove(options.roundErrorClass);
            this.cardClose(history.first, options.openCardClass);
            this.cardClose(history.second, options.openCardClass);
          }
          // чистим очередь
          history.first = null;
          history.second = null;
        }

        // Если очередь пуста
        if (!history.first && !history.second) {
          // сохораняем первый клик
          history.first = control;
          // открываем карточку
          this.cardOpen(control, options.openCardClass);
          return;
        }

        if (history.first && !history.second) {
          // сохранение клика второго значения
          history.second = control;
          // открываем карточку
          this.cardOpen(control, options.openCardClass);
          // проверка валидации и присвоение класса
          if (
            this.calculateMove(
              history.first.dataset.emojiId,
              history.second.dataset.emojiId,
            )
          ) {
            // подсвечиваем успех
            history.first.classList.add(options.roundSuccessClass);
            history.second.classList.add(options.roundSuccessClass);
          } else {
            // подсвечиваем ошибку
            history.first.classList.add(options.roundErrorClass);
            history.second.classList.add(options.roundErrorClass);
          }
          return;
        }

        console.log(history);
      }
    }.bind(this),
  );
}

/**
 * Вчисляет разницу между двумя объектами с разными id
 * @param firsId id первого объекта
 * @param secondId id второго объекта
 * @returns {boolean}
 */
Game.prototype.calculateMove = function(firsId, secondId) {
  var currentEmojies = this._emojies.filter(function(item) {
    return item.id === firsId || item.id == secondId;
  });

  if (currentEmojies.length === 2) {
    var firsIcon = currentEmojies[0].icon;
    var secondIcon = currentEmojies[1].icon;
    return firsIcon === secondIcon && firsId !== secondId;
  }

  return false;
};

/**
 * Генерирует моссив с парами объектов для игры
 * @param arr массив строк с эмоджи
 * @returns {*} массив объектов Emoji
 */
Game.prototype.generateCouple = function(arr) {
  return arr.reduce(function(previousValue, currentValue, currentIndex) {
    return previousValue.concat([
      new Emoji(currentValue, "first-" + currentIndex),
      new Emoji(currentValue, "second-" + currentIndex),
    ]);
  }, []);
};

/**
 * Функция перемешивания массива
 * @param array входной массив
 * @returns {*}
 */
Game.prototype.mixCards = function(array) {
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
};

/**
 * Показывает карточку
 * @param card элемент карточки
 * @param openCardClass добавляемы класс
 */
Game.prototype.cardOpen = function(card, openCardClass) {
  card.classList.add(openCardClass);
};

/**
 * Скрывает карточку
 * @param card элемент карточки
 * @param openCardClass удаляемый класс
 */
Game.prototype.cardClose = function(card, openCardClass) {
  card.classList.remove(openCardClass);
};

/**
 * Конструктор сущьности Emoji
 * @param icon строка-иконка
 * @param id идентивикатор
 * @constructor
 */
function Emoji(icon, id) {
  this.icon = icon;
  this.id = id;
}
