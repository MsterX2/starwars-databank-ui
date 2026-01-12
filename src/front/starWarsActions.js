import { apiRequest } from "./apiRequest";


const fetchData = async (dispatch, endpoint, startAction, successAction, errorFallback, transform) => {
    dispatch({ type: startAction });

    const response = await apiRequest(endpoint, "GET");

    if (response.ok) {
        const payload = transform ? transform(response.data) : response.data;
        dispatch({
            type: successAction,
            payload,
        });
    } else {
        dispatch({
            type: "FETCH_ERROR",
            payload: response.notFoundText || response.statusText || errorFallback,
        });
    }
};



export const fetchPeople = (dispatch, endpoint) => {
    return fetchData(
        dispatch,
        endpoint,
        "FETCH_START",
        "FETCH_PEOPLE_SUCCESS",
        "Error fetching people"
    );
};

export const fetchPlanets = (dispatch, endpoint) => {
    return fetchData(
        dispatch,
        endpoint,
        "FETCH_START",
        "FETCH_PLANETS_SUCCESS",
        "Error fetching planets"
    );
};

export const fetchVehicles = (dispatch, endpoint) => {
    return fetchData(
        dispatch,
        endpoint,
        "FETCH_START",
        "FETCH_VEHICLES_SUCCESS",
        "Error fetching vehicles"
    );
};

export const fetchDetail = (dispatch, endpoint) => {
    return fetchData(
        dispatch,
        endpoint,
        "FETCH_DETAIL_START",
        "FETCH_DETAIL_SUCCESS",
        "Error fetching detail",
        (data) =>
            Object.entries(data.result.properties).map(([label, value]) => ({ label, value }))
    );
};

export const toggleLike = (dispatch, uid) => {
    dispatch({
        type: "TOGGLE_LIKE",
        payload: uid,
    });
};
