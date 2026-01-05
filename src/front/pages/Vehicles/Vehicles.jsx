import React, { useContext, useEffect, useState } from 'react';
import { StarWarsCard } from '../../components/StarWarsCard';
import { searchContext } from '../Layout';
import { apiRequest } from '../../apiRequest';
import { useNavigate } from 'react-router-dom';
import { Planets } from '../Planets/Planets';

export const Vehicles = () => {
    const [searchTerm, setSearchTerm] = useContext(searchContext);
    const [vehiclesData, setVehiclesData] = useState([])
    const [filteredVehicles, setFilteredVehicles] = useState([])
    const [previous, setPrevious] = useState([])
    const [next, setNext] = useState([])

    const host = "https://www.swapi.tech/api";
    const uri = "vehicles";

    const getData = async (endpoint) => {
        const data = await apiRequest(endpoint, "GET");
        if (!data.results) return;
        setVehiclesData(data.results)
        setPrevious(data.previous)
        setNext(data.next)
    }

    const handleNext = () => {
        console.log(next)
        if (next) getData(next)
    }
    const handlePrevious = () => {
        console.log(previous)
        if (previous) getData(previous)
    }
    useEffect(
        () => {
            getData(`${host}/${uri}`)
        }, [])

    useEffect(
        () => {
            if (vehiclesData.length == 0) return;
            const filtrados = vehiclesData.filter(vehicle =>
                vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredVehicles(filtrados)
        }, [vehiclesData,]
    )


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
                    filteredVehicles.map((vehicle) => (
                        <StarWarsCard
                            key={vehicle.uid}
                            id={vehicle.uid}
                            title={vehicle.name}
                            items={[]}
                            uri={uri}
                            endpoint={vehicle.url}
                        />
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <div className="no-results">
                            <i className="fas fa-search fa-3x mb-3"></i>
                            <h3>No vehicles found</h3>
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
