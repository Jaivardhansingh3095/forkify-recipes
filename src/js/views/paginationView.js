import View from './view.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goto = +btn.dataset.goto;
      handler(goto);
    });
  }

  _generateMarkup() {
    let curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //console.log(curPage, numPages, this._data.);
    //if page no. is 1 and other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateBtnMarkup('next', curPage);
    }

    //if current page is between fist and last page
    if (curPage > 1 && curPage < numPages) {
      return `${this._generateBtnMarkup(
        'prev',
        curPage
      )}${this._generateBtnMarkup('next', curPage)}`;
    }

    //if current page is last page
    if (curPage === numPages && numPages > 1) {
      return this._generateBtnMarkup('prev', curPage);
    }

    //if there is single page only
    if (numPages === 1) {
      return '';
    }
  }

  _generateBtnMarkup(direction, page) {
    if (direction === 'prev') {
      return `
            <button data-goto="${
              page - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${page - 1}</span>
            </button>`;
    }

    if (direction === 'next') {
      return `
        <button data-goto="${
          page + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;
    }
  }
}

export default new PaginationView();
