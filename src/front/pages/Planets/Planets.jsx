import React, { useContext, useEffect, useMemo } from 'react';
import { StarWarsCard } from '../../components/StarWarsCard';
import { searchContext } from '../Layout';
import { fetchPlanets } from '../../starWarsActions';
import { useStarWarsContext } from '../../hooks/useStarWarsContext';

export const Planets = () => {
    const [searchTerm] = useContext(searchContext);
    const { state, dispatch } = useStarWarsContext();
    const { planets, previous, next, loading } = state;

    const host = "https://www.swapi.tech/api";
    const uri = "planets";

    useEffect(() => {
        fetchPlanets(dispatch, `${host}/${uri}`);
    }, []);

    const filteredPlanets = useMemo(() => {
        return planets.filter(planet =>
            planet.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [planets, searchTerm]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-warning mb-4" role="status" style={{ width: "4rem", height: "4rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>

                    <h3 className="section-title mt-3">
                        <i className="fas fa-jedi me-2"></i>
                        Loading planets
                    </h3>

                    <p className="section-subtitle">
                        Curiosity: Tatooine is the home planet of both Anakin Skywalker and Luke Skywalker!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="section-title">
                    <i className="fas fa-globe me-3"></i>
                    PLANETS & SYSTEMS
                </h2>
                <p className="section-subtitle">
                    <i className="fas fa-satellite me-2"></i>
                    Worlds Across the Galaxy
                </p>
            </div>

            <div className="row">
                {filteredPlanets.length > 0 ? (
                    filteredPlanets.map(planet => (
                        <StarWarsCard
                            key={planet.uid}
                            item={planet}
                            type="planets"
                        />
                    ))
                ) : (
                    !loading && (
                        <div className="col-12 text-center">
                            <div className="no-results">
                                <i className="fas fa-search fa-3x mb-3"></i>
                                <h3>No planets found</h3>
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
                    onClick={() => fetchPlanets(dispatch, previous)}
                >
                    <i className="fas fa-chevron-left me-2"></i>
                    Previous
                </button>
                <button
                    className="btn btn-outline-warning px-4"
                    disabled={!next}
                    onClick={() => fetchPlanets(dispatch, next)}
                >
                    Next
                    <i className="fas fa-chevron-right ms-2"></i>
                </button>
            </div>
        </div>
    );
};
