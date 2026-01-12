import React from 'react';
import { useCrudContext } from '../../hooks/useContactsContex.jsx';
import { useAnimationContext } from '../../hooks/useAnimationContext.jsx';
import { apiRequest } from '../../apiRequest.js';
import { useNavigate } from 'react-router-dom';

export const Contact = ({ id, name, address, phone, email }) => {
    const context = useCrudContext();
    const { setAnimatingId,
        setAnimationType } = useAnimationContext();
    const navigate = useNavigate()
    const user = "chanchitoFeliz";
    const image = `https://api.dicebear.com/7.x/personas/svg?seed=${id}`;
    const host = "https://playground.4geeks.com/contact";

    if (!context) {
        throw new Error('Contact must be used within ContactContextProvider');
    }
    const handleClick = event => {
        navigate("/contacts/details", { state: { id, name, address, phone, email, image } })
    }
    const {
        setEditValue,
        contacts,
        setContacts
    } = context;

    const handleEdit = (e) => {
        e.stopPropagation();
        const editingContact = contacts.find(contact => contact.id === id);
        if (editingContact) {
            setEditValue({
                method: "PUT",
                contact: editingContact
            });
        }
    };

    const handleDelete = async e => {
        e.stopPropagation();
        setAnimatingId(id);
        setAnimationType('delete');
        const { ok } = await apiRequest(`${host}/agendas/${user}/contacts/${id}`, "DELETE")
        if (ok) {
            setContacts(contacts.filter(contact => contact.id !== id));
            setTimeout(() => {
                setAnimatingId(null);
                setAnimationType(null);
            }, 1000);
            return
        }
        console.log("Error al eliminar")
    };

    return (
        <li className="list-group-item contact-item" onClick={handleClick}>
            <div className="userData">
                <img
                    className="userImage"
                    src={image}
                    alt="userImage"
                />
                <div className="userDetails">
                    <span><b>{name}</b></span>
                    <span className="userInfo"><i className="fas fa-map-marker-alt"></i><span>{address}</span></span>
                    <span className="userInfo"><i className="fas fa-phone"></i><span>{phone}</span></span>
                    <span className="userInfo"><i className="fas fa-envelope"></i><span>{email}</span></span>
                </div>
            </div>

            <div className="actionButtons">
                <span
                    onClick={handleEdit}
                    className="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                >
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>

                <span
                    onClick={handleDelete}
                    className="btn btn-danger btn-sm ms-2"
                >
                    <i className="fa-solid fa-trash"></i>
                </span>
            </div>
        </li>
    );
};
