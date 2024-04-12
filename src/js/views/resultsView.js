import View from './view.js';
import icons from '../../img/icons.svg';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found. Please try again!';

  _generateMarkup() {
    return this._data.map(el => previewView.render(el, false)).join('');
  }
}

export default new ResultsView();
