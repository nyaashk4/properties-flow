import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProperty } from "../api/propertiesApi";
import "./PropertyPage.css";
import useFavorites from "../hooks/useFavorites";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import formatRooms from "../utils/formatRooms";
import { useState, useEffect } from "react";

function PropertyPage() {
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const navigate = useNavigate();

  const { id } = useParams();

  const [imageError, setImageError] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isImageOpen, setIsImageOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchProperty(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) =>
      error.message !== "NOT_FOUND" && failureCount < 3,
  });

  const imageCount = data?.images?.length
    ? data.images.length
    : data?.image
      ? 1
      : 0;

  useEffect(() => {
    if (!isImageOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsImageOpen(false);
      }

      if (event.key === "ArrowLeft" && imageCount > 1) {
        event.preventDefault();

        setCurrentImageIndex((prev) =>
          prev === 0 ? imageCount - 1 : prev - 1,
        );

        setImageError(false);
      }

      if (event.key === "ArrowRight" && imageCount > 1) {
        event.preventDefault();

        setCurrentImageIndex((prev) =>
          prev === imageCount - 1 ? 0 : prev + 1,
        );

        setImageError(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isImageOpen, imageCount]);

  useEffect(() => {
    if (!isImageOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isImageOpen]);

  if (isLoading) {
    return <Loader message="Загрузка квартиры..." />;
  }

  if (error) {
    if (error.message === "NOT_FOUND") {
      return (
        <ErrorMessage
          message="Квартира не найдена"
          onBack={() => navigate("/")}
        />
      );
    }

    return (
      <ErrorMessage
        message="Не удалось загрузить квартиру"
        onBack={() => navigate("/")}
      />
    );
  }
  const images = data.images?.length
    ? data.images
    : data.image
      ? [data.image]
      : [];

  const currentImage = images[currentImageIndex];

  const isFavorite = favorites.some((favorite) => favorite.id === data.id);

  function handleFavorite() {
    if (isFavorite) {
      removeFavorite(data.id);
    } else {
      addFavorite(data);
    }
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
    <main className="property-page-wrapper">
      <button className="property-back" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <article className="property-page">
        <div className="property-page-gallery">
          {imageError || !currentImage ? (
            <div className="property-page-image-error">
              Изображение недоступно
            </div>
          ) : (
            <img
              className="property-page-image"
              src={currentImage}
              alt={data.title}
              onError={() => setImageError(true)}
              onClick={() => setIsImageOpen(true)}
              style={{ cursor: "zoom-in" }}
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

        {images.length > 1 && (
          <div className="property-page-thumbnails">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`property-page-thumbnail ${
                  currentImageIndex === index ? "active" : ""
                }`}
                onClick={() => {
                  setCurrentImageIndex(index);
                  setImageError(false);
                }}
                aria-label={`Выбрать фотографию ${index + 1}`}
              >
                <img src={image} alt={`${data.title} — фото ${index + 1}`} />
              </button>
            ))}
          </div>
        )}

        <div className="property-page-content">
          <h1 className="property-page-title">{data.title}</h1>

          <p className="property-page-location">{data.city}</p>
          <p className="property-page-description">{data.description}</p>

          <div className="property-page-details">
            <div>
              <span>Цена</span>
              <strong>{data.price.toLocaleString("ru-RU")} ₽</strong>
            </div>

            <div>
              <span>Площадь</span>
              <strong>{data.area} м²</strong>
            </div>

            <div>
              <span>Комнаты</span>
              <strong>{formatRooms(data.rooms)}</strong>
            </div>

            <div>
              <span>Тип недвижимости</span>
              <strong>{data.type}</strong>
            </div>

            <div>
              <span>Район</span>
              <strong>{data.district}</strong>
            </div>

            {data.metroMinutes !== undefined && (
              <div>
                <span>Метро</span>
                <strong>Ⓜ️ {data.metroMinutes} мин. пешком</strong>
              </div>
            )}
          </div>

          <button className="property-page-favorite" onClick={handleFavorite}>
            {isFavorite ? "❤️ В избранном" : "🤍 В избранное"}
          </button>
        </div>
      </article>

      {isImageOpen && (
        <div
          className="image-modal"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsImageOpen(false);
            }
          }}
        >
          <button
            type="button"
            className="image-modal-close"
            onClick={() => setIsImageOpen(false)}
            aria-label="Закрыть просмотр"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="image-modal-arrow image-modal-prev"
                onClick={handlePrevImage}
                aria-label="Предыдущее фото"
              >
                ‹
              </button>

              <button
                type="button"
                className="image-modal-arrow image-modal-next"
                onClick={handleNextImage}
                aria-label="Следующее фото"
              >
                ›
              </button>
            </>
          )}

          <img
            src={currentImage}
            alt={data.title}
            className="image-modal-photo"
            onClick={(event) => event.stopPropagation()}
          />

          <span className="image-modal-counter">
            {currentImageIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </main>
  );
}

export default PropertyPage;
