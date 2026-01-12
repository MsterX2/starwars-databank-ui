import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import notFound from "../../assets/img/big-placeholder.jpg";

export const ContactDetails = () => {
    const { state: data } = useLocation();
    const navigate = useNavigate();

    if (!data) return null;

    return (
        <div className="detail-view-container">
            <div className="detail-card row g-0">

                <div className="col-md-5">
                    <img
                        src={data.image || notFound}
                        alt={data.name}
                        className="detail-image"
                    />
                </div>

                <div className="col-md-7 detail-content">
                    <h2 className="detail-title">{data.name}</h2>

                    <div className="detail-info-grid">
                        <div className="detail-info-item">
                            <i className="fas fa-user"></i>
                            <span className="detail-label">Name</span>
                            <span className="detail-value">{data.name}</span>
                        </div>

                        <div className="detail-info-item">
                            <i className="fas fa-envelope"></i>
                            <span className="detail-label">Email</span>
                            <span className="detail-value">{data.email}</span>
                        </div>

                        <div className="detail-info-item">
                            <i className="fas fa-phone"></i>
                            <span className="detail-label">Phone</span>
                            <span className="detail-value">{data.phone}</span>
                        </div>

                        <div className="detail-info-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span className="detail-label">Address</span>
                            <span className="detail-value">{data.address}</span>
                        </div>
                    </div>

                    <button
                        className="btn star-wars-back-button mt-4"
                        onClick={() => navigate(-1)}
                    >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back
                    </button>
                </div>

            </div>
        </div>
    );
};
