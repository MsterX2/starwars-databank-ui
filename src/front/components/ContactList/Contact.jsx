import React from 'react';
import { useAnimationContext } from '../../hooks/useAnimationContext.jsx';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from '../../hooks/useContactsContex.jsx';
import { deleteContact } from '../../action.js';

export const Contact = ({ id, name, address, phone, email, setEditValue }) => {
    const { setAnimatingId,
        setAnimationType } = useAnimationContext();
    const navigate = useNavigate()
    const { store, dispatch } = useGlobalReducer();
    const { contacts, loading, error } = store;
    const user = "chanchitoFeliz";
    const image = `https://api.dicebear.com/7.x/personas/svg?seed=${id}`;
    const host = "https://playground.4geeks.com/contact";

    const handleClick = event => {
        navigate("/contacts/details", { state: { id, name, address, phone, email, image } })
    }

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

    const handleDelete = async (e) => {
        e.stopPropagation();

        setAnimatingId(id);
        setAnimationType("delete");

        const ok = await deleteContact(dispatch, host, user, id);

        if (ok) {
            setTimeout(() => {
                setAnimatingId(null);
                setAnimationType(null);
            }, 1000);
        } else {
            console.log("Error al eliminar el contacto");
            setAnimatingId(null);
            setAnimationType(null);
        }
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
