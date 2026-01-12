import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../apiRequest';

export const DetailView = () => {
    const [items, setItems] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate()
    const { id } = useParams();
    const location = useLocation();
    const image = location.state.image;

    const getData = async (endpoint) => {
        const { data } = await apiRequest(endpoint, "GET");
        const properties = Object.entries(data.result.properties).map(
            ([label, value]) => ({ label, value })
        );
        setItems(properties);
    };

    const title = "T-16 skyhopper";

    useEffect(() => {
        getData(location.state.endpoint);
    }, []);

    const handleLikeToggle = () => {
        setIsLiked(!isLiked);
    };

    const onBack = () => {
        navigate(-1)
    }

    return (
        <div className="container py-5">
            <div className="detail-view-container">
                <button onClick={onBack} className="btn btn-secondary mb-4 star-wars-back-button">
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to List
                </button>

                <div className="detail-card">
                    <div className="row g-0">
                        <div className="col-md-5 position-relative">
                            <img src={image} alt={title} className="detail-image" />

                            <button
                                className={`like-button ${isLiked ? 'liked' : ''}`}
                                onClick={handleLikeToggle}
                            >
                                <i className="fas fa-heart"></i>
                            </button>
                        </div>

                        <div className="col-md-7">
                            <div className="detail-content">
                                <h2 className="detail-title">{title}</h2>

                                <div className="detail-info-grid">
                                    {items.map((item, index) => (
                                        <div key={index} className="detail-info-item">
                                            <span className="detail-label">{item.label}:</span>
                                            <span className="detail-value">{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
