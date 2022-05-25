import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {COMMENT_EMOTIONS} from '../const.js';
import {getDuration, humanizeDate} from '../utils/film.js';

const createFilmDetailTemplate = (film, commentsList) => {
  const { id, comments, filmInfo, userDetails } = film;

  const watchlistClassName = userDetails.watchlist
    ? 'film-details__control-button--active'
    : '';

  const watchedClassName = userDetails.alreadyWatched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-details__control-button--active'
    : '';

  return (
    `<section class="film-details" data-id="${id}">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${filmInfo.poster}" alt="">

              <p class="film-details__age">${filmInfo.ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmInfo.title}</h3>
                  <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmInfo.totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmInfo.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${humanizeDate(filmInfo.release.date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${getDuration(filmInfo.runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${filmInfo.genre.map((it) => `<span class="film-details__genre">${it}</span>`).join('\n')}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${filmInfo.description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsList.map((it) => `
                  <li class="film-details__comment">
                    <span class="film-details__comment-emoji">
                      <img src="./images/emoji/${it.emotion}.png" width="55" height="55" alt="emoji-${it.emotion}">
                    </span>
                    <div>
                      <p class="film-details__comment-text">${it.comment}</p>
                      <p class="film-details__comment-info">
                        <span class="film-details__comment-author">${it.author}</span>
                        <span class="film-details__comment-day">${humanizeDate(it.date)}</span>
                        <button class="film-details__comment-delete">Delete</button>
                      </p>
                    </div>
                  </li>
                `).join('\n')}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${COMMENT_EMOTIONS.map((it) => `
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${it}" value="${it}">
                  <label class="film-details__emoji-label" for="emoji-${it}">
                    <img src="./images/emoji/${it}.png" width="30" height="30" alt="emoji">
                  </label>
                `).join('')}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetailView extends AbstractStatefulView {
  #comments = null;

  constructor(film, comments) {
    super();

    this._state = FilmDetailView.parseFilmToState(film);
    this.#comments = comments;
  }

  get template() {
    return createFilmDetailTemplate(this._state, this.#comments);
  }

  static parseFilmToState = (film) => ({...film });

  static parseStateToFilm = (state) => ({...state});

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
