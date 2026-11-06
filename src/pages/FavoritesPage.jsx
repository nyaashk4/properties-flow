import PropertyCard from "../components/PropertyCard";
import useFavorites from "../hooks/useFavorites";
import { useNavigate } from "react-router-dom";
import "./FavoritesPage.css";

function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, clearFavorites } = useFavorites();

  function handleClearFavorites() {
    const isConfirmed = window.confirm(
      "Вы действительно хотите удалить все объекты из избранного?",
    );

    if (isConfirmed) {
      clearFavorites();
    }
  }

  if (favorites.length === 0) {
    return (
      <main className="favorites-page favorites-empty">
        <div className="favorites-empty-content">
          <h1>Избранное пусто</h1>
          <p>Добавляйте понравившиеся квартиры в избранное.</p>

          <button type="button" onClick={() => navigate("/")}>
            Смотреть недвижимость
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="favorites-page">
      <div className="favorites-header">
        <div>
          <h1>Избранное</h1>
          <p>Вы сохранили объектов: {favorites.length}</p>
        </div>

        <button
          type="button"
          className="favorites-clear"
          onClick={handleClearFavorites}
        >
          Очистить избранное
        </button>
      </div>

      <div className="favorites-list">
        {favorites.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </main>
  );
}

export default FavoritesPage;
