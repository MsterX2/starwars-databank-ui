import React, { useContext, useEffect, useState } from 'react';
import { StarWarsCard } from '../../components/StarWarsCard';
import { searchContext } from '../Layout';
import { apiRequest } from '../../apiRequest';
import { useNavigate } from 'react-router-dom';

export const People = () => {
    const [searchTerm, setSearchTerm] = useContext(searchContext);
    const [peopleData, setPeopleData] = useState([])
    const [filteredPeople, setFilteredVehicles] = useState([])
    const host = "https://www.swapi.tech/api/";
    const uri = "people"

    const getData = async () => {
        const data = await apiRequest(`${host}/${uri}`, "GET");
        setPeopleData(data.results)
    }

    const handleNext = () => { }
    const handlePrevious = () => { }

    useEffect(
        () => {
            getData()
        }, [])

    useEffect(
        () => {
            if (peopleData.length == 0) return;
            const filtrados = peopleData.filter(vehicle =>
                vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredVehicles(filtrados)
        }, [peopleData,]
    )

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="section-title">
                    <i className="fas fa-users me-3"></i>
                    CHARACTERS
                </h2>
                <p className="section-subtitle">
                    <i className="fas fa-jedi me-2"></i>
                    Heroes and Villains of the Galaxy
                </p>
            </div>
            <div className="row">
                {filteredPeople.length > 0 ? (
                    filteredPeople.map((person) => (
                        <StarWarsCard
                            key={person.uid}
                            title={person.name}
                            items={[]}
                            id={person.uid}
                            uri={uri}
                            endpoint={person.url}
                        />
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <div className="no-results">
                            <i className="fas fa-search fa-3x mb-3"></i>
                            <h3>No characters found</h3>
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
