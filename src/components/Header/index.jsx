import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
    return (
        <div className="H_container">
            <div className="H_links">
                <Link to="/" className="H_link">Accueil</Link>
                <Link to="/openings" className="H_link">Ouvertures</Link>
                <Link to="/puzzles" className="H_link">Puzzles</Link>
            </div>
        </div>
    )
}

export default Header;
