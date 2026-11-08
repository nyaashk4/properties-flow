import "./PropertyCard.css";
import { Link } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";
import formatRooms from "../utils/formatRooms";
import { useState } from "react";

function PropertyCard({ property }) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const isFavorite = favorites.some((favorite) => favorite.id === property.id);

  const images = property.images?.length
    ? property.images
    : property.image
      ? [property.image]
      : [];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const currentImage = images[currentImageIndex];

  function handleFavorite() {
    isFavorite ? removeFavorite(property.id) : addFavorite(property);
  }

  function handlePrevImage() {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setImageError(false);
  }

  function handleNextImage() {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setImageError(false);
  }

  return (
    <article className="property-card">
      <div className="property-card-gallery">
        {imageError || !currentImage ? (
          <div className="property-card-image-error">
            Изображение недоступно
          </div>
        ) : (
          <img
            src={currentImage}
            alt={property.title}
            onError={() => setImageError(true)}
          />
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-prev"
              onClick={handlePrevImage}
              aria-label="Предыдущее фото"
            >
              ‹
            </button>

            <button
              type="button"
              className="gallery-arrow gallery-arrow-next"
              onClick={handleNextImage}
              aria-label="Следующее фото"
            >
              ›
            </button>

            <span className="gallery-counter">
              {currentImageIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

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
