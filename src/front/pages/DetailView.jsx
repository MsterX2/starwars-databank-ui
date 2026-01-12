import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchDetail, toggleLike } from '../starWarsActions';
import { useStarWarsContext } from '../hooks/useStarWarsContext';

export const DetailView = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { state, dispatch } = useStarWarsContext();

    const { detail, likes, loading } = state;
    const { endpoint, image, title } = location.state;

    const isLiked = likes.includes(id);

    useEffect(() => {
        fetchDetail(dispatch, endpoint);
    }, []);

    return (
        <div className="container py-5">
            <div className="detail-view-container">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-secondary mb-4 star-wars-back-button"
                >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to List
                </button>

                <div className="detail-card">
                    <div className="row g-0">
                        <div className="col-md-5 position-relative">
                            <img src={image} alt={title} className="detail-image" />

                            <button
                                className={`like-button ${isLiked ? "liked" : ""}`}
                                onClick={() => toggleLike(dispatch, id)}
                            >
                                <i className="fas fa-heart"></i>
                            </button>
                        </div>

                        <div className="col-md-7">
                            <div className="detail-content">
                                <h2 className="detail-title">{title}</h2>

                                {loading ? (
                                    <div className="text-center">
                                        <div className="spinner-border text-warning" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading details... Fun fact: Lightsabers can cut through almost anything!</p>
                                    </div>
                                ) : (
                                    <div className="detail-info-grid">
                                        {detail.map((item, index) => (
                                            <div key={index} className="detail-info-item">
                                                <span className="detail-label">{item.label}:</span>
                                                <span className="detail-value">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
