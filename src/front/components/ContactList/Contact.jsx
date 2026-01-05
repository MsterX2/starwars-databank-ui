import React from 'react';
import { useCrudContext } from '../../hooks/useContactsContex.jsx';
import { useAnimationContext } from '../../hooks/useAnimationContext.jsx';

export const Contact = ({ id, name, address, phone, email }) => {
    const context = useCrudContext();
    const { setAnimatingId,
        setAnimationType } = useAnimationContext();

    if (!context) {
        throw new Error('Contact must be used within ContactContextProvider');
    }

    const {
        setEditValue,
        contacts,
        setContacts
    } = context;

    const handleEdit = (e) => {
        e.stopPropagation();
        const contact = contacts.find(c => c.id === id);
        if (contact) {
            setEditValue({
                method: "PUT",
                contact: contact
            });
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setAnimatingId(id);
        setAnimationType('delete');
        setTimeout(() => {
            setContacts(contacts.filter(contact => contact.id !== id));
            setAnimatingId(null);
            setAnimationType(null);
        }, 500);
    };

    return (
        <li className="list-group-item contact-item">
            <div className="userData">
                <img
                    className="userImage"
                    src={`https://loremflickr.com/80/80/starwars?lock=${id}`}
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
