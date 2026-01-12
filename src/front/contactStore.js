export const initialStore = () => ({
    contacts: [],
    loading: false,
    error: null,
});

export default function storeReducer(state, action) {
    switch (action.type) {

        case "FETCH_CONTACTS_START":
            return {
                ...state,
                loading: true,
                error: null,
            };

        case "FETCH_CONTACTS_SUCCESS":
            return {
                ...state,
                contacts: action.payload,
                loading: false,
            };

        case "FETCH_CONTACTS_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case "ADD_CONTACT":
            return {
                ...state,
                contacts: [...state.contacts, action.payload],
            };

        case "UPDATE_CONTACT":
            return {
                ...state,
                contacts: state.contacts.map(contact =>
                    contact.id === action.payload.id
                        ? { ...contact, ...action.payload }
                        : contact
                ),
            };

        case "DELETE_CONTACT":
            return {
                ...state,
                contacts: state.contacts.filter(
                    contact => contact.id !== action.payload
                ),
            };

        default:
            return state;
    }
}
