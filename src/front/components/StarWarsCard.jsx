import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const images = import.meta.glob("../assets/img/**/*.jpg", { eager: true })
import notFound from "../assets/img/big-placeholder.jpg"
export const StarWarsCard = ({ title, items, uri, id, endpoint }) => {
    const image = images[`../assets/img/${uri}/${id}.jpg`]?.default;
    const navigate = useNavigate();

    const [showLike] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    const handleClick = async (id, endpoint, uri) => {
        navigate(`/${uri}/${id}`, { state: { endpoint, image } })
    };

    const handleLikeToggle = (e) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };


    return (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div
                className="card h-100 star-wars-card"
                onClick={() => handleClick(id, endpoint, uri)}
                style={{ cursor: 'pointer' }}
            >
                <img src={image || notFound} className="card-img-top" alt={title} />

                {showLike && (
                    <button
                        className={`like-button ${isLiked ? 'liked' : ''}`}
                        onClick={handleLikeToggle}
                    >
                        <i className={`fas fa-heart`}></i>
                    </button>
                )}

                <div className="card-body">
                    <h5 className="card-title">
                        <i className="fas fa-jedi me-2"></i>
                        {title}
                    </h5>
                    <ul className="list-group list-group-flush">
                        {items.map((item, index) => (
                            <li key={index} className="list-group-item">
                                <i className="fas fa-chevron-right me-2"></i>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
