import React, { useContext, useEffect, useMemo } from 'react';
import { StarWarsCard } from '../../components/StarWarsCard.jsx';
import { searchContext } from '../Layout.jsx';
import { fetchPeople } from '../../starWarsActions.js';
import { useStarWarsContext } from '../../hooks/useStarWarsContext';

export const People = () => {
    const [searchTerm] = useContext(searchContext);
    const { state, dispatch } = useStarWarsContext();
    const { people, previous, next, loading } = state;

    const host = "https://www.swapi.tech/api";
    const uri = "people";

    useEffect(() => {
        fetchPeople(dispatch, `${host}/${uri}`);
    }, []);

    const filteredPeople = useMemo(() => {
        return people.filter(person =>
            person.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [people, searchTerm]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-warning mb-4" role="status" style={{ width: "4rem", height: "4rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>

                    <h3 className="section-title mt-3">
                        <i className="fas fa-jedi me-2"></i>
                        Loading characters
                    </h3>

                    <p className="section-subtitle">
                        Fun fact: There are over 20,000 characters in the Star Wars expanded universe!
                    </p>
                </div>
            </div>
        );
    }

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
                    filteredPeople.map(person => (
                        <StarWarsCard
                            key={person.uid}
                            item={person}
                            type="people"
                        />
                    ))
                ) : (
                    !loading && (
                        <div className="col-12 text-center">
                            <div className="no-results">
                                <i className="fas fa-search fa-3x mb-3"></i>
                                <h3>No characters found</h3>
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
                    onClick={() => fetchPeople(dispatch, previous)}
                >
                    <i className="fas fa-chevron-left me-2"></i>
                    Previous
                </button>
                <button
                    className="btn btn-outline-warning px-4"
                    disabled={!next}
                    onClick={() => fetchPeople(dispatch, next)}
                >
                    Next
                    <i className="fas fa-chevron-right ms-2"></i>
                </button>
            </div>
        </div>
    );
};
