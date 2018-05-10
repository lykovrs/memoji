/**
 * Создает игру Эмоджи
 * @param options объект опций игры
 * @constructor
 */
function Game(options) {
  // генерируем пары
  this._emojies = this.generateCouple(["🦀", "🐟", "🐊", "🐓", "🦃", "🐿"]);

  // рендерим карточки и начинаем игру
  this.start(options);

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
 * Стартует сессию игры
 * @param options объект опций игры
 */
Game.prototype.start = function(options) {
  // подчищаем старые краточки, если они есть
  options.rootElement.innerHTML = null;
  // Счетчик времени игры
  this._timeCounter = 0;
  // перемешиваем массив
  this.mixCards(this._emojies);
  // Добавляем рандомную последовательность карточек на страницу
  this._collection = this._emojies.map(function(item) {
    var element = new EmojiNode(item, options.classCard);
    options.rootElement.appendChild(element);
    return element;
  });
  // для принятия решения нужно знать хотябы последне три корректных хода
  this._history = {
    first: null,
    second: null,
    third: null,
  };
};

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

/**
 * Создает HTML-элемент Эмоджи
 * @param item сущьность Emoji
 * @param cls класс, обозначающий элемент
 * @returns {HTMLElement}
 * @constructor
 */
function EmojiNode(item, cls) {
  var element = document.createElement("article");
  element.dataset.card = "";
  element.classList.add(cls);
  element.dataset.emoji = item.icon;
  element.dataset.emojiId = item.id;

  return element;
}

/**
 * Конструктор модального окна
 * @constructor
 */
function Modal() {
  this._button = document.createElement("button");
  this._button.classList.add("modal__action");

  this._message = document.createElement("h2");
  this._message.classList.add("modal__message");

  var container = document.createElement("article");
  container.classList.add("modal__container");

  container.appendChild(this._message);
  container.appendChild(this._button);

  this._overlay = document.createElement("div");
  this._overlay.classList.add("modal");

  this._overlay.appendChild(container);
  document.body.appendChild(this._overlay);
}

/**
 * Открывает окно
 * @param text заголовок
 * @param buttonText текст на кнопке
 * @param callback функция обратного вызова на кнопке
 */
Modal.prototype.open = function(text, buttonText, callback) {
  this._button.addEventListener("click", callback, false);

  this._button.innerText = buttonText;

  this._message.innerHTML = text;

  this._overlay.classList.add("modal_type_open");
};

/**
 * Закрывает окно
 * @param callback убирает обработчик события
 */
Modal.prototype.close = function(callback) {
  this._overlay.classList.remove("modal_type_open");
  this._button.removeEventListener("click", callback, false);
  this._button.innerText = null;
  this._message.innerHTML = null;
};
