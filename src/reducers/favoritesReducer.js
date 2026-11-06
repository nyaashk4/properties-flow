import {
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  CLEAR_FAVORITES,
} from "./favoritesActions";

function favoritesReducer(state, action) {
  switch (action.type) {
    case ADD_FAVORITE:
      return [...state, action.payload];

    case REMOVE_FAVORITE:
      return state.filter((property) => property.id !== action.payload);

    case CLEAR_FAVORITES:
      return [];

    default:
      return state;
  }
}

export default favoritesReducer;
