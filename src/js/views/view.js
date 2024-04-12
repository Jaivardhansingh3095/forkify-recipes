import icons from '../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.errorHandler();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this.renderSpinner();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const markup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(markup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // console.log(curElements);
    // console.log(newElements);
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //Update the changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      //update the changed attributes value
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(att => {
          return curEl.setAttribute(att.name, att.value);
        });
      }
    });
  }

  renderSpinner() {
    let markup = `
          <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="recipe">
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  errorHandler(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
