import { createContext, useContext, useState } from "react";

export const crudContext = createContext(undefined);
export const singleContactContext = createContext(undefined);

export const ContactContextProvider = ({ children }) => {
    const [editValue, setEditValue] = useState(null);
    const [singleContact, setSingleContact] = useState({
        id: 0,
        name: "",
        address: "",
        phone: "",
        email: ""
    });

    const [contacts, setContacts] = useState([]);

    return (
        <crudContext.Provider
            value={{
                editValue,
                setEditValue,
                contacts,
                setContacts
            }}
        >
            <singleContactContext.Provider value={{ singleContact, setSingleContact }}>
                {children}
            </singleContactContext.Provider>
        </crudContext.Provider>
    );
};


export const useCrudContext = () => {
    const {
        editValue,
        setEditValue,
        contacts,
        setContacts
    } = useContext(crudContext)
    return {
        editValue, setEditValue, contacts, setContacts
    }
}

export const useSingleContact = () => {
    const { singleContact, setSingleContact } = useContext(singleContactContext)
    return { singleContact, setSingleContact }
}