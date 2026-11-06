import { NavLink } from "react-router-dom";
import FavoritesContext from "../context/FavoritesContext";
import { useContext } from "react";
import "./Navbar.css";

function NavBar() {
  const { favorites } = useContext(FavoritesContext);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          Flow
        </NavLink>

        <nav className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Недвижимость
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Избранное
            <span className="favorites-count">{favorites.length}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
