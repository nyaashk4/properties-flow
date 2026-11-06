import { createContext, useReducer, useEffect } from "react";
import favoritesReducer from "../reducers/favoritesReducer";

const FavoritesContext = createContext([]);

function loadFavorites() {
  try {
    const favorites = localStorage.getItem("favorites");

    if (!favorites) {
      return [];
    }
    return JSON.parse(favorites);
  } catch (error) {
    console.error("Не удалось загрузить избранное", error);
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, [], loadFavorites);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext;
