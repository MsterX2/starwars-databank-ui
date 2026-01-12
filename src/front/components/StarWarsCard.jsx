import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStarWarsContext } from '../hooks/useStarWarsContext.jsx';
const images = import.meta.glob("../assets/img/**/*.jpg", { eager: true })
import notFound from "../assets/img/big-placeholder.jpg"


export const StarWarsCard = ({ item, type }) => {
    const { state, dispatch } = useStarWarsContext();
    const image = images[`../assets/img/${type}/${item.uid}.jpg`]?.default;
    const navigate = useNavigate();

    const isLiked = state.likes.some(like => like.uid === item.uid && like.type === type);

    const handleClick = () => {
        navigate(`/${type}/${item.uid}`, { state: { endpoint: item.url, image } })
    };

    const handleLikeToggle = (e) => {
        e.stopPropagation();
        dispatch({ type: 'TOGGLE_LIKE', payload: { ...item, type } });
    };


    return (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div
                className="card h-100 star-wars-card"
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
            >
                <img src={image || notFound} className="card-img-top" alt={item.name} />

                <button
                    className={`like-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleLikeToggle}
                >
                    <i className={`fas fa-heart`}></i>
                </button>

                <div className="card-body">
                    <h5 className="card-title">
                        <i className="fas fa-jedi me-2"></i>
                        {item.name}
                    </h5>
                    <ul className="list-group list-group-flush">
                        {/* Puedes agregar propiedades específicas aquí si quieres */}
                    </ul>
                </div>
            </div>
        </div>
    );
};
