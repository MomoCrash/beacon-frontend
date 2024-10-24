import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import '../pages_style/home_style.css';
import { Helmet } from 'react-helmet';
import { SearchBar } from '../components/searchbar.jsx';
import { CustomNavbar } from '../components/navbar.jsx';
import { Footer } from '../components/footer.jsx';
import Menu from '../components/Menu.jsx';

function Home() {
    const [showMenu, setShowMenu] = useState(localStorage.getItem('hasVisited') !== 'true');

    function displayFirstLoadMenu() {
        if (showMenu) {
            return <Menu onClose={() => setShowMenu(false)} />;
        }
    }

    function handleShowMenu() {
        setShowMenu(true);
    }

    return (
        <>
            <Helmet>
                <title>Beacon</title>
                <meta name="description" content="This is a website to improve your level on League of Legends"/>
                <meta http-equiv="pragma" content="no-cache"/>
                <meta charSet="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link rel="shortcut icon" href="/beacon-frontend/img/logo_beacon.png"/>
            </Helmet>

            <div id="wallpaper"></div>

            {displayFirstLoadMenu()}

            <div>
                <CustomNavbar/>

                <div className="download-container">
                    <span className="button_lg">
                        <span className="button_sl"></span>
                        <span className="button_text">Télécharger l'application</span>
                    </span>
                </div>

                <div className="content-container">
                    <Container className="content">
                        <img className="title-image" src="/beacon-frontend/img/Beacon_Title.png" alt="BEACON" draggable="false"/>
                        <SearchBar/>
                    </Container>
                </div>

                <div className="show-menu-button-container">
                    <button className="show-menu-button" onClick={handleShowMenu}>Réafficher le Menu</button>
                </div>

            </div>
        </>
    );
}

export default Home;
