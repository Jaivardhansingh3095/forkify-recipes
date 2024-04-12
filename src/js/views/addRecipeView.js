import View from './view.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _message = 'Recipe was added successfully!';

  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerCloseWindow();
  }

  _toggleHidden() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleHidden.bind(this));
  }

  addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this._toggleHidden.bind(this));
    this._overlay.addEventListener('click', this._toggleHidden.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      //the FormData takes form data as argument. Here the submit button is point to form
      //data. Hence we pass the 'this' as an argument
      let data = Object.fromEntries([...new FormData(this)]);
      //console.log(data);
      handler(data);
    });
  }
}

export default new AddRecipeView();
