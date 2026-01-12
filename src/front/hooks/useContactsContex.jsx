import { useContext, useReducer, createContext } from "react";
import storeReducer, { initialStore } from "../contactStore";

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore());

    return (
        <StoreContext.Provider value={{ store, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}

export default function useGlobalReducer() {
    return useContext(StoreContext);
}
