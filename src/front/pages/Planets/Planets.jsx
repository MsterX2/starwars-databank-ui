import React, { useContext, useEffect, useState } from 'react';
import { StarWarsCard } from '../../components/StarWarsCard';
import { searchContext } from '../Layout';
import { apiRequest } from '../../apiRequest';
import { useNavigate } from 'react-router-dom';

export const Planets = () => {
    const [searchTerm, setSearchTerm] = useContext(searchContext);
    const [planetsData, setPlanetsData] = useState([])
    const [filteredPlanets, setFilteredPlanets] = useState([])

    const host = "https://www.swapi.tech/api";
    const uri = "planets"

    const getData = async () => {
        const data = await apiRequest(`${host}/${uri}`, "GET");
        setPlanetsData(data.results)
    }

    const handleNext = () => { }
    const handlePrevious = () => { }
    useEffect(
        () => {
            getData()
        }, [])

    useEffect(
        () => {
            if (planetsData.length == 0) return;
            const filtrados = planetsData.filter(planet =>
                planet.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPlanets(filtrados)
        }, [planetsData,]
    )

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
                    filteredPlanets.map((planet) => (
                        <StarWarsCard
                            key={planet.uid}
                            title={planet.name}
                            items={[]}
                            id={planet.uid}
                            uri={uri}
                            endpoint={planet.url}
                        />
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <div className="no-results">
                            <i className="fas fa-search fa-3x mb-3"></i>
                            <h3>No planets found</h3>
                            <p>Try adjusting your search term</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="d-flex justify-content-center gap-3 my-4">
                <button
                    className="btn btn-outline-warning px-4"
                    onClick={handlePrevious}
                >
                    <i className="fas fa-chevron-left me-2"></i>
                    Previous
                </button>
                <button
                    className="btn btn-outline-warning px-4"
                    onClick={handleNext}
                >
                    Next
                    <i className="fas fa-chevron-right ms-2"></i>
                </button>
            </div>
        </div>
    );
};
