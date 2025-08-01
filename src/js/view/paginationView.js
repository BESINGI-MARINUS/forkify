import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultsPerPage
    );

    const curPage = this._data.page;

    //We are in page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupBtnNext(curPage);
    }
    // We are in the last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupBtnPrev(curPage);
    }
    //we are in another page
    if (curPage < numPages) {
      return `${this._generateMarkupBtnPrev(curPage)}
      ${this._generateMarkupBtnNext(curPage)}`;
    }
    //We are on page 1 and there are no other pages
    return '';
  }

  _generateMarkupBtnPrev(curPage) {
    return `
        <button class="btn--inline pagination__btn--prev" data-page=${
          curPage - 1
        }>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;
  }
  _generateMarkupBtnNext(curPage) {
    return `
      <button class="btn--inline pagination__btn--next" data-page=${
        curPage + 1
      } >
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.page;

      handler(goToPage);
    });
  }
}

export default new PaginationView();
