import React from 'react';
import { useStarWarsContext } from '../hooks/useStarWarsContext.jsx';
import { StarWarsCard } from '../components/StarWarsCard.jsx';

export const Favorites = () => {
    const { state } = useStarWarsContext();

    const favoritePeople = state.likes.filter(like => like.type === 'people');
    const favoritePlanets = state.likes.filter(like => like.type === 'planets');
    const favoriteVehicles = state.likes.filter(like => like.type === 'vehicles');

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="section-title">
                    <i className="fas fa-heart me-3"></i>
                    MY FAVORITES
                </h2>
                <p className="section-subtitle">
                    <i className="fas fa-galaxy me-2"></i>
                    Your favorite characters, planets, and vehicles
                </p>
            </div>

            <h3 className="mb-3">People</h3>
            <div className="row mb-4">
                {favoritePeople.length > 0 ? (
                    favoritePeople.map(person => (
                        <StarWarsCard key={person.uid} item={person} type="people" />
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <div className="no-results">
                            <i className="fas fa-user fa-3x mb-3"></i>
                            <h4>No favorite people yet</h4>
                        </div>
                    </div>
                )}
            </div>

            <h3 className="mb-3">Planets</h3>
            <div className="row mb-4">
                {favoritePlanets.length > 0 ? (
                    favoritePlanets.map(planet => (
                        <StarWarsCard key={planet.uid} item={planet} type="planets" />
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <div className="no-results">
                            <i className="fas fa-globe fa-3x mb-3"></i>
                            <h4>No favorite planets yet</h4>
                        </div>
                    </div>
                )}
            </div>

            <h3 className="mb-3">Vehicles</h3>
            <div className="row">
                {favoriteVehicles.length > 0 ? (
                    favoriteVehicles.map(vehicle => (
                        <StarWarsCard key={vehicle.uid} item={vehicle} type="vehicles" />
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <div className="no-results">
                            <i className="fas fa-rocket fa-3x mb-3"></i>
                            <h4>No favorite vehicles yet</h4>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
