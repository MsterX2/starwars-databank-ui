export const initialState = {
    people: [],
    planets: [],
    vehicles: [],
    detail: [],
    likes: (() => {
        const stored = localStorage.getItem('starWarsLikes');
        if (stored && stored !== 'undefined' && stored !== 'null') {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed.filter(like => like && typeof like === 'object' && like.uid) : [];
        }
        return [];
    })(),
    previous: null,
    next: null,

    loading: false,
    error: null,
};

export const starWarsReducer = (state, action) => {
    switch (action.type) {
        case "FETCH_START":
            return {
                ...state,
                loading: true,
                error: null,
            };

        case "FETCH_PEOPLE_SUCCESS":
            return {
                ...state,
                people: action.payload.results,
                previous: action.payload.previous,
                next: action.payload.next,
                loading: false,
            };

        case "FETCH_PLANETS_SUCCESS":
            return {
                ...state,
                planets: action.payload.results,
                previous: action.payload.previous,
                next: action.payload.next,
                loading: false,
            };

        case "FETCH_VEHICLES_SUCCESS":
            return {
                ...state,
                vehicles: action.payload.results,
                previous: action.payload.previous,
                next: action.payload.next,
                loading: false,
            };

        case "FETCH_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case "FETCH_DETAIL_START":
            return { ...state, loading: true };

        case "FETCH_DETAIL_SUCCESS":
            return { ...state, loading: false, detail: action.payload };

        case "TOGGLE_LIKE":
            if (!action.payload || !action.payload.uid || !action.payload.type) return state;
            const isLiked = state.likes.some(like => like.uid === action.payload.uid && like.type === action.payload.type);
            const newLikes = isLiked
                ? state.likes.filter(like => !(like.uid === action.payload.uid && like.type === action.payload.type))
                : [...state.likes, action.payload];
            localStorage.setItem('starWarsLikes', JSON.stringify(newLikes));
            return {
                ...state,
                likes: newLikes,
            }
        default:
            return state;
    }
};
