import React, { useState, useEffect } from 'react';
import { useCrudContext } from '../../hooks/useContactsContex.jsx';
import { useAnimationContext } from '../../hooks/useAnimationContext.jsx';

export const ContactForm = () => {
    const context = useCrudContext();
    const { setAnimatingId,
        setAnimationType } = useAnimationContext()
    if (!context) {
        throw new Error('ContactForm must be used within ContactContextProvider');
    }

    const {
        editValue,
        setEditValue,
        contacts,
        setContacts
    } = context;

    const [contactForm, setContactForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });

    useEffect(() => {
        if (editValue && editValue.method === "PUT" && editValue.contact) {
            setContactForm({
                name: editValue.contact.name,
                phone: editValue.contact.phone,
                email: editValue.contact.email,
                address: editValue.contact.address
            });
        } else {
            setContactForm({
                name: '',
                phone: '',
                email: '',
                address: ''
            });
        }
    }, [editValue]);

    const handleInput = (e) => {
        const type = e.target.dataset.type;
        setContactForm({
            ...contactForm,
            [type]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editValue?.method === "POST") {
            const newContact = {
                id: Math.max(...contacts.map(c => c.id), 0) + 1,
                ...contactForm
            };
            setContacts([...contacts, newContact]);

            setAnimatingId(newContact.id);
            setAnimationType('add');

            setTimeout(() => {
                setAnimatingId(null);
                setAnimationType(null);
            }, 1000);

        } else if (editValue?.method === "PUT" && editValue.contact) {
            setContacts(
                contacts.map(contact =>
                    contact.id === editValue.contact.id
                        ? { ...contact, ...contactForm }
                        : contact
                )
            );

            setAnimatingId(editValue.contact.id);
            setAnimationType('edit');

            setTimeout(() => {
                setAnimatingId(null);
                setAnimationType(null);
            }, 1000);
        }

        setContactForm({
            name: '',
            phone: '',
            email: '',
            address: ''
        });
        setEditValue(null);
    };

    const handleClose = () => {
        setEditValue(null);
        setContactForm({
            name: '',
            phone: '',
            email: '',
            address: ''
        });
    };

    return (
        <div
            className="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
        >
            <form className="mb-3" onSubmit={handleSubmit}>
                <div className="modal-dialog">
                    <div className="modal-content star-wars-modal">

                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                <i className="fas fa-user-plus me-2"></i>
                                {editValue?.method === "PUT" ? 'Edit Contact' : 'Add New Contact'}
                            </h1>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={handleClose}
                            ></button>
                        </div>

                        <div className="modal-body">
                            <label htmlFor="contactName" className="form-label">Name</label>
                            <input
                                onChange={handleInput}
                                value={contactForm.name}
                                data-type="name"
                                type="text"
                                className="form-control star-wars-input"
                                id="contactName"
                                placeholder="Luke Skywalker"
                                required
                            />

                            <label htmlFor="contactPhone" className="form-label mt-3">Phone</label>
                            <input
                                onChange={handleInput}
                                value={contactForm.phone}
                                data-type="phone"
                                type="tel"
                                className="form-control star-wars-input"
                                id="contactPhone"
                                placeholder="+1-555-FORCE"
                                required
                            />

                            <label htmlFor="contactEmail" className="form-label mt-3">Email</label>
                            <input
                                onChange={handleInput}
                                value={contactForm.email}
                                data-type="email"
                                type="email"
                                className="form-control star-wars-input"
                                id="contactEmail"
                                placeholder="jedi@rebellion.com"
                                required
                            />

                            <label htmlFor="contactAddress" className="form-label mt-3">Address</label>
                            <input
                                onChange={handleInput}
                                value={contactForm.address}
                                data-type="address"
                                type="text"
                                className="form-control star-wars-input"
                                id="contactAddress"
                                placeholder="Tatooine, Mos Eisley"
                                required
                            />
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={handleClose}
                            >
                                Close
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                            >
                                <i className="fas fa-save me-2"></i>
                                {editValue?.method === "PUT" ? 'Update' : 'Save'}
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    );
};
