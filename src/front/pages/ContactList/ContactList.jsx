import React, { useContext, useState } from 'react';
import { Contact } from '../../components/ContactList/Contact.jsx';
import { ContactForm } from '../../components/ContactList/ContactForm.jsx';
import { useCrudContext } from '../../hooks/useContactsContex.jsx';
import { searchContext } from '../Layout.jsx';
import { useAnimationContext } from '../../hooks/useAnimationContext.jsx';


export const ContactList = () => {
	const context = useCrudContext();
	const { animatingId,
		animationType } = useAnimationContext()
	const [searchTerm, setSearchTerm] = useContext(searchContext);

	if (!context) {
		throw new Error('ContactList must be used within ContactContextProvider');
	}

	const {
		contacts,
		setEditValue
	} = context;

	const handleAddNew = () => {
		setEditValue({ method: "POST" });
	};

	const filteredContacts = contacts.filter(contact =>
		contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
		contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
		contact.address.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="container py-5">
			<div className="text-center mb-5">
				<h2 className="section-title">
					<i className="fas fa-address-book me-3"></i>
					CONTACT LIST
				</h2>
				<p className="section-subtitle">
					<i className="fas fa-users me-2"></i>
					Your Galaxy Network
				</p>
			</div>

			<div className="mb-4">
				<button
					onClick={handleAddNew}
					type="button"
					className="btn btn-primary btn-lg star-wars-button"
					data-bs-toggle="modal"
					data-bs-target="#staticBackdrop"
				>
					<i className="fas fa-user-plus me-2"></i>
					Add new Contact
				</button>
			</div>

			<ContactForm />

			<ul className="list-group contact-list">
				{filteredContacts.length > 0 ? (
					filteredContacts.map((element) => (
						<div
							key={element.id}
							className={`contact-wrapper ${animatingId === element.id
								? animationType === 'add'
									? 'contact-add-animation'
									: animationType === 'edit'
										? 'contact-edit-animation'
										: 'contact-delete-animation'
								: ''
								}`}
						>
							<Contact
								id={element.id}
								name={element.name}
								address={element.address}
								phone={element.phone}
								email={element.email}
							/>
						</div>
					))
				) : (
					<div className="col-12 text-center">
						<div className="no-results">
							<i className="fas fa-search fa-3x mb-3"></i>
							<h3>No contacts found</h3>
							<p>Try adjusting your search term</p>
						</div>
					</div>
				)}
			</ul>
		</div>
	);
};
