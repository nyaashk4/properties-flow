import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="not-found">
      <div className="not-found-content">
        <span className="not-found-code">404</span>

        <h1>Страница не найдена</h1>

        <p>Похоже, такой страницы не существует или она была удалена.</p>

        <button onClick={() => navigate("/")}>
          ← Вернуться к недвижимости
        </button>
      </div>
    </main>
  );
}

export default NotFoundPage;
