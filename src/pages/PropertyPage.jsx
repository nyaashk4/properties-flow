import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProperty } from "../api/propertiesApi";
import "./PropertyPage.css";
import useFavorites from "../hooks/useFavorites";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import formatRooms from "../utils/formatRooms";
import { useState } from "react";

function PropertyPage() {
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const navigate = useNavigate();

  const { id } = useParams();

  const [imageError, setImageError] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchProperty(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) =>
      error.message !== "NOT_FOUND" && failureCount < 3,
  });

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

  const isFavorite = favorites.some((favorite) => favorite.id === data.id);

  function handleFavorite() {
    if (isFavorite) {
      removeFavorite(data.id);
    } else {
      addFavorite(data);
    }
  }
  return (
    <main className="property-page-wrapper">
      <button className="property-back" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <article className="property-page">
        {imageError ? (
          <div className="property-page-image-error">
            Изображение недоступно
          </div>
        ) : (
          <img
            className="property-page-image"
            src={data.image}
            alt={data.title}
            onError={() => setImageError(true)}
          />
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
    </main>
  );
}

export default PropertyPage;
