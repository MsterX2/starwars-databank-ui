import { createContext, useContext, useState } from "react";

export const ContactAnimationContext = createContext(undefined)

export const ContactAnimationContextProvider = ({ children }) => {
    const [animatingId, setAnimatingId] = useState(null);
    const [animationType, setAnimationType] = useState(null);
    return (
        <ContactAnimationContext.Provider value={{ animatingId, setAnimatingId, animationType, setAnimationType }} >
            {children}
        </ContactAnimationContext.Provider >
    )
}

export const useAnimationContext = () => {
    const { animatingId, setAnimatingId, animationType, setAnimationType } = useContext(ContactAnimationContext)
    return { animatingId, setAnimatingId, animationType, setAnimationType }
}