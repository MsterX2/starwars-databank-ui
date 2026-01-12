import { apiRequest } from "./apiRequest";


const handleApi = async (dispatch, apiCall, startAction, successAction, errorFallback, transform) => {
    if (startAction) dispatch({ type: startAction });

    const response = await apiCall();

    if (response.ok) {
        const payload = transform ? transform(response.data) : response.data;
        if (successAction) {
            dispatch({
                type: successAction,
                payload,
            });
        }
    } else {
        dispatch({
            type: successAction ? successAction.replace("_SUCCESS", "_ERROR") : "FETCH_ERROR",
            payload: response.notFoundText || response.statusText || errorFallback,
        });
    }

    return response;
};


export const fetchContacts = (dispatch, host, user) => {
    return handleApi(
        dispatch,
        () =>
            apiRequest(`${host}/agendas/${user}`, "GET", {
                notFoundText: `El usuario ${user} no existe, por favor cree un nuevo usuario`,
            }),
        "FETCH_CONTACTS_START",
        "FETCH_CONTACTS_SUCCESS",
        "Error fetching contacts",
        (data) => data.contacts
    );
};

export const createContact = (dispatch, host, user, contactForm) => {
    return handleApi(
        dispatch,
        () => apiRequest(`${host}/agendas/${user}/contacts`, "POST", { body: contactForm }),
        null,
        "ADD_CONTACT",
        "Error creating contact"
    );
};

export const updateContact = (dispatch, host, user, contactId, contactForm) => {
    return handleApi(
        dispatch,
        () =>
            apiRequest(`${host}/agendas/${user}/contacts/${contactId}`, "PUT", {
                body: contactForm,
            }),
        null,
        "UPDATE_CONTACT",
        "Error updating contact"
    );
};

export const deleteContact = (dispatch, host, user, id) => {
    return handleApi(
        dispatch,
        () => apiRequest(`${host}/agendas/${user}/contacts/${id}`, "DELETE"),
        null,
        "DELETE_CONTACT",
        "Error deleting contact",
        () => id // payload será el id en DELETE
    );
};
