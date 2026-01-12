import { createContext, useContext, useReducer } from "react";
import { initialState, starWarsReducer } from "../starWarsStore";

export const StarWarsContext = createContext(null);

export const StarWarsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(starWarsReducer, initialState);

    return (
        <StarWarsContext.Provider value={{ state, dispatch }}>
            {children}
        </StarWarsContext.Provider>
    );
};


export const useStarWarsContext = () => {
    const { state, dispatch } = useContext(StarWarsContext);
    return { state, dispatch };
};
