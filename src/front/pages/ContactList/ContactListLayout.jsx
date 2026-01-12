import { ContactAnimationContextProvider } from "../../hooks/useAnimationContext.jsx";
import { StoreProvider } from "../../hooks/useContactsContex.jsx";
import { ContactList } from "./ContactList";


export const ContactListLayout = () => {
    return (
        <StoreProvider>
            <ContactAnimationContextProvider>
                <ContactList />
            </ContactAnimationContextProvider>
        </StoreProvider>
    )
}
