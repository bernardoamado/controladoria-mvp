import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import cloudIcon from '../../assets/Cloud.svg'
import profileIcon from '../../assets/CommonActions.svg';
import '../styles/Navbar.css';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const atHome = useMemo(() => location.pathname === '/', [location.pathname]);
  const goToHome = () => navigate('/');
  return (
    <nav className="navbar clearfix">
      <div className="left-floating">
        <div className="system-label">
          { (!atHome) && <button
            className="back-btn clickable"
            onClick={() => navigate(-1)}
          ><i className="fa-solid fa-arrow-left"></i></button>}
          <span className="system-name" onClick={goToHome}>Controladoria</span>
        </div>
      </div>

      <div className="right-floating">
        <ul className="inline-list">
          <li id="sync-icon">
            <img src={cloudIcon} alt="sincronia" />
          </li>
          <li id="fiscal-year" className="upper-label">
            <label className="upper-label" htmlFor="year-select">Ano de exerc&iacute;cio</label>
            <select className="clickable" name="selected-year" id="year-select">
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </li>
          <li id="organization" className="upper-label">
            <label className="upper-label" htmlFor="organization-select">Organiza&ccedil;&atilde;o</label>
            <select className="clickable" name="selected-organization" id="organization-select">
              <option value="SpaceX">SpaceX</option>
              <option value="Tesla">Tesla</option>
              <option value="Starlink">Starlink</option>
              <option value="X">X</option>
            </select>
          </li>
          <li id="user-profile">
            <img className="clickable" src={profileIcon} alt="profile" />
          </li>
        </ul>
      </div>
    </nav>
  );
}