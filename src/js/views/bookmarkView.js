import View from './view.js';
import previewView from './previewView.js';
import icons from '../../img/icons.svg';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Please add your favorite recipe ;)';

  addHandlerLoadBookmarks(handler) {
    window.addEventListener('load', handler());
  }

  _generateMarkup() {
    return this._data.map(el => previewView.render(el, false)).join('');
  }
}

export default new BookmarkView();
