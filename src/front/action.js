import { apiRequest } from "./apiRequest";
const host = import.meta.env.VITE_BACKEND_URL

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
        () => id
    );
};

export const login = async (dispatch, credentials) => {
    const url = `${host}/api/login`
    const user = {
        email: credentials.email,
        password: credentials.password
    };
    const response = await apiRequest(url, "POST", { body: user });
    if (!response.ok) return false;
    dispatch({
        type: "LOGIN",
        payload: { ...response.data.results }
    });
    return response.data
};

export const signup = async (dispatch, formData) => {
    const url = `${host}/api/users`
    const newUser = {
        email: formData.email,
        first_name: formData.first_name,
        password: formData.password,
        is_active: formData.is_active
    };
    const response = await apiRequest(url, "POST", { body: newUser });
    if (!response.ok) return false;
    dispatch({
        type: "SIGNUP",
        payload: { ...response.data.results }
    });
    return response.data
};

export const logout = (dispatch) => {
    dispatch({ type: "LOGOUT" });
    return { ok: true };
};

export const protect = async () => {
    console.log("funcion protect");
    const options = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
    };
    console.log(options);
    const response = await apiRequest(`${host}/api/protected`, "GET", options);
    if (!response.ok) {
        console.log("Error", response.status, response.statusText);
        return false;
    };
    const data = response.data;
    console.log(data)
    return data
};