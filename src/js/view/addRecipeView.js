import View from './View';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _successMessage = 'Recipe uploaded successfully';

  constructor() {
    super();
    this._addHandlerShowModal();
    this._addHandlerHideModal();
  }

  toggleHiddenClass() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowModal() {
    this._btnOpen.addEventListener('click', this.toggleHiddenClass.bind(this));
  }

  _addHandlerHideModal() {
    this._btnClose.addEventListener('click', this.toggleHiddenClass.bind(this));
    this._overlay.addEventListener('click', this.toggleHiddenClass.bind(this));
  }

  addHandlerUploadRecipe(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new addRecipeView();
