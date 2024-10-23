import React, { useState, useEffect } from 'react';
import '../pages_style/menu_style.css';
import clickSound from '../assets/sound-effect-lol-for-beacon.mp3';

function Menu({ onClose }) {
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');

        if (!hasVisited) {
            setIsFirstVisit(true);
            localStorage.setItem('hasVisited', 'true');
        } else {
            setIsFirstVisit(true);
        }

        setHoveredIndex(null);
    }, []);

    if (!isFirstVisit) {
        return null;
    }

    const cards = [
        {
            title: 'Traqueur de statistiques',
            image: '/beacon-frontend/img/menu_img/Malphite_menu_img.png',
            link: '/beacon-frontend/'
        },
        {
            title: 'Contenu pédagogique',
            image: '/beacon-frontend/img/menu_img/Aatrox_menu_img.png',
            link: '/beacon-frontend/guide'
        },
        {
            title: 'E-sport',
            image: '/beacon-frontend/img/menu_img/Leblanc_menu_img.png',
            link: '/beacon-frontend/e-sport'
        }
    ];

    const handleCardClick = (index) => {
        onClose();
        window.location.href = cards[index].link;
    };

    const playSound = () => {
        const audio = new Audio(clickSound);
        audio.play();
    };

    return (
        <div className="menu-container-menu">
            <div className="card-carousel-menu">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`card-menu ${index === hoveredIndex ? 'selected' : ''}`}
                        onClick={() => handleCardClick(index)}
                        onMouseEnter={() => {
                            setHoveredIndex(index);
                            playSound();
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <img src={card.image} alt={card.title} className="card-image" />
                    </div>
                ))}
            </div>
            <div className="card-titles-menu">
                {cards.map((card, index) => (
                    <h2 key={index} className={`card-title-menu ${index === hoveredIndex ? 'highlighted' : ''}`}>
                        {card.title}
                    </h2>
                ))}
            </div>
        </div>
    );
}

export default Menu;
