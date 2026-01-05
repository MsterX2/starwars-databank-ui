import { ContactContextProvider } from "../../hooks/useContactsContex";
import { ContactAnimationContextProvider } from "../../hooks/useAnimationContext";
import { ContactList } from "./ContactList";


export const ContactListLayout = () => {
    return (
        <ContactContextProvider>
            <ContactAnimationContextProvider>
                <ContactList />
            </ContactAnimationContextProvider>
        </ContactContextProvider>
    )
}
