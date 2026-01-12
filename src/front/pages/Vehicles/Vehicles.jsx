import React, { useContext, useEffect, useMemo } from 'react';
import { StarWarsCard } from '../../components/StarWarsCard';
import { searchContext } from '../Layout';
import { fetchVehicles } from '../../starWarsActions';
import { useStarWarsContext } from '../../hooks/useStarWarsContext';

export const Vehicles = () => {
    const [searchTerm] = useContext(searchContext);
    const { state, dispatch } = useStarWarsContext();
    const { vehicles, previous, next, loading } = state;

    const host = "https://www.swapi.tech/api";
    const uri = "vehicles";

    useEffect(() => {
        fetchVehicles(dispatch, `${host}/${uri}`);
    }, []);

    const filteredVehicles = useMemo(() => {
        return vehicles.filter(vehicle =>
            vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [vehicles, searchTerm]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-warning mb-4" role="status" style={{ width: "4rem", height: "4rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>

                    <h3 className="section-title mt-3">
                        <i className="fas fa-jedi me-2"></i>
                        Loading vehicles
                    </h3>

                    <p className="section-subtitle">
                        Did you know? The X-Wing fighter has four engines and can reach speeds of 1,050 km/h!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="section-title">
                    <i className="fas fa-rocket me-3"></i>
                    VEHICLES & STARSHIPS
                </h2>
                <p className="section-subtitle">
                    <i className="fas fa-space-shuttle me-2"></i>
                    Legendary Ships of the Galaxy
                </p>
            </div>

            <div className="row">
                {filteredVehicles.length > 0 ? (
                    filteredVehicles.map(vehicle => (
                        <StarWarsCard
                            key={vehicle.uid}
                            item={vehicle}
                            type="vehicles"
                        />
                    ))
                ) : (
                    !loading && (
                        <div className="col-12 text-center">
                            <div className="no-results">
                                <i className="fas fa-search fa-3x mb-3"></i>
                                <h3>No vehicles found</h3>
                                <p>Try adjusting your search term</p>
                            </div>
                        </div>
                    )
                )}
            </div>

            <div className="d-flex justify-content-center gap-3 my-4">
                <button
                    className="btn btn-outline-warning px-4"
                    disabled={!previous}
                    onClick={() => fetchVehicles(dispatch, previous)}
                >
                    <i className="fas fa-chevron-left me-2"></i>
                    Previous
                </button>
                <button
                    className="btn btn-outline-warning px-4"
                    disabled={!next}
                    onClick={() => fetchVehicles(dispatch, next)}
                >
                    Next
                    <i className="fas fa-chevron-right ms-2"></i>
                </button>
            </div>
        </div>
    );
};
