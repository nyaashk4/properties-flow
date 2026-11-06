import "./PropertyCard.css";
import { Link } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";
import formatRooms from "../utils/formatRooms";
import { useState } from "react";

function PropertyCard({ property }) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const isFavorite = favorites.some((favorite) => favorite.id === property.id);

  function handleFavorite() {
    isFavorite ? removeFavorite(property.id) : addFavorite(property);
  }
  const [imageError, setImageError] = useState(false);

  return (
    <article className="property-card">
      {imageError ? (
        <div className="property-card-image-error">Изображение недоступно</div>
      ) : (
        <img
          src={property.image}
          alt={property.title}
          onError={() => setImageError(true)}
        />
      )}

      <div className="property-card-content">
        <Link className="property-card-title" to={`/property/${property.id}`}>
          {property.title}
        </Link>

        <p className="property-card-type">{property.type}</p>

        <p className="property-card-location">
          {property.city}, {property.district}
        </p>

        <p className="property-card-price">
          {property.price.toLocaleString("ru-RU")} ₽
        </p>

        <ul className="property-card-info">
          <li>{property.area} м²</li>
          <li>{formatRooms(property.rooms)}</li>
          {property.metroMinutes !== undefined && (
            <li className="metro-info">
              Ⓜ️ До метро: {property.metroMinutes} мин. пешком
            </li>
          )}
        </ul>

        <button
          type="button"
          className="property-card-favorite"
          onClick={handleFavorite}
          aria-pressed={isFavorite}
        >
          {isFavorite ? "❤️ В избранном" : "🤍 В избранное"}
        </button>
      </div>
    </article>
  );
}

export default PropertyCard;
