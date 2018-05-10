/**
 * Создает игру Эмоджи
 * @param options объект опций игры
 * @constructor
 */
function Game(options) {
  this._options = options;
  // генерируем пары
  this._emojies = this._generateCouple(["🦀", "🐟", "🐊", "🐓", "🦃", "🐿"]);

  // здесь храним id таймера для рау
  this._timerId = null;

  // модадльное окно
  this._modal = null;

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
          this._cardClose(control, options.openCardClass);
          // обновляем очередь
          if (control === history.first) {
            // убираем подсветку первого контрола
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
            !this._calculateMove(
              history.first.dataset.emojiId,
              history.second.dataset.emojiId,
            )
          ) {
            history.first.classList.remove(options.roundErrorClass);
            history.second.classList.remove(options.roundErrorClass);
            this._cardClose(history.first, options.openCardClass);
            this._cardClose(history.second, options.openCardClass);
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
          this._cardOpen(control, options.openCardClass);
          return;
        }

        if (history.first && !history.second) {
          // сохранение клика второго значения
          history.second = control;
          // открываем карточку
          this._cardOpen(control, options.openCardClass);
          // проверка валидации и присвоение класса
          if (
            this._calculateMove(
              history.first.dataset.emojiId,
              history.second.dataset.emojiId,
            )
          ) {
            // подсвечиваем успех
            history.first.classList.add(options.roundSuccessClass);
            history.second.classList.add(options.roundSuccessClass);

            // проверяем результат
            var result = this._calculateResult(options.roundSuccessClass);
            // если все карты открыты
            if (result) {
              var self = this;
              self._modal.open("Play again", "Win", function() {
                // делаем рестарт
                self.start(options);
                // закрываем модалку
                self._modal.close(self.start);
              });
            }
          } else {
            // подсвечиваем ошибку
            history.first.classList.add(options.roundErrorClass);
            history.second.classList.add(options.roundErrorClass);
          }
        }
      }
    }.bind(this),
  );

  // создаем каркас модального окна
  this._modal = new Modal();
}

/**
 * Стартует сессию игры
 */
Game.prototype.start = function() {
  // чистим таймеры, если остались
  if (this._timerId) clearInterval(this._timerId);

  // подчищаем старые краточки, если они есть
  this._options.rootElement.innerHTML = null;
  // Счетчик времени игры
  this._timeCounter = this._options.timeRound;
  // перемешиваем массив
  this._mixCards(this._emojies);
  // Добавляем рандомную последовательность карточек на страницу
  var openCls = this._options.classCard;
  var root = this._options.rootElement;
  this._collection = this._emojies.map(function(item) {
    var element = new EmojiNode(item, openCls);
    root.appendChild(element);
    return element;
  });
  // для принятия решения нужно знать хотябы последне три корректных хода
  this._history = {
    first: null,
    second: null,
    third: null,
  };

  // начинаем раунд игры
  this._startRound();
};

/**
 * Вчисляет разницу между двумя объектами с разными id
 * @param firsId id первого объекта
 * @param secondId id второго объекта
 * @returns {boolean}
 */
Game.prototype._calculateMove = function(firsId, secondId) {
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

Game.prototype._startRound = function() {
  this._timerId = setInterval(
    function() {
      if (!this._timeCounter) {
        clearInterval(this._timerId)
        // проверяем результат
        var result = this._calculateResult(this._options.roundSuccessClass);
        var opts = this._options;
        var modal = this._modal;
        var self = this;

        // если все карты открыты
        if (!result) {
          this._modal.open("Try again", "Lose", function() {
            // делаем рестарт
            self.start(opts);
            // закрываем модалку
            modal.close(self.start);
          });
        }


      }
      var timerElement = this._options.timerElement
        renderTime(timerElement, this._timeCounter)
      this._timeCounter--;
    }.bind(this),
    1000,
  );
};

/**
 * Генерирует моссив с парами объектов для игры
 * @param arr массив строк с эмоджи
 * @returns {*} массив объектов Emoji
 */
Game.prototype._generateCouple = function(arr) {
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
Game.prototype._mixCards = function(array) {
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
Game.prototype._cardOpen = function(card, openCardClass) {
  card.classList.add(openCardClass);
};

/**
 * Скрывает карточку
 * @param card элемент карточки
 * @param openCardClass удаляемый класс
 */
Game.prototype._cardClose = function(card, openCardClass) {
  card.classList.remove(openCardClass);
};

/**
 * Вычисляет результат игры
 * @param cls класс-признак отыграной карты
 * @returns {boolean}
 */
Game.prototype._calculateResult = function(cls) {
  return this._collection.every(function(item) {
    return item.classList.contains(cls);
  });
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

/**
 * Отображает строку отсчета
 * @param element элемент, содержимое которого обновляем
 * @param time обновляемое значение
 */
function renderTime(element, time) {
    element.innerHTML = "00-" + (+time < 10 ? "0" + time : time);
}
