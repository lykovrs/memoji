function memoji(rootElement, openCardClass) {
    // делегируем клик
    rootElement.addEventListener('click', function (ev) {
        var control = ev.target;
        // выбираем только целевый элементы-карточки
        if('card' in control.dataset) {
            console.log(ev.target)
            control.classList.toggle(openCardClass)
        }

    })
}