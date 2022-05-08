import AbstractView from '../framework/view/abstract-view.js';

const createFilmsContainerTemplate = () => (
  `<div class="films-list__container"></div>
  `
);

export default class FilmsContainer extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createFilmsContainerTemplate();
  }
}
