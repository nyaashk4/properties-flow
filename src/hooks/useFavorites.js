import { useContext } from "react";
import FavoritesContext from "../context/FavoritesContext";
import {
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  CLEAR_FAVORITES,
} from "../reducers/favoritesActions";

function useFavorites() {
  const { favorites, dispatch } = useContext(FavoritesContext);

  function addFavorite(property) {
    dispatch({
      type: ADD_FAVORITE,
      payload: property,
    });
  }

  function removeFavorite(id) {
    dispatch({
      type: REMOVE_FAVORITE,
      payload: id,
    });
  }
  function clearFavorites() {
    dispatch({
      type: CLEAR_FAVORITES,
    });
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
  };
}

export default useFavorites;
