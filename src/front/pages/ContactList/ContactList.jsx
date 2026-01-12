import React, { useContext, useEffect, useState } from 'react';
import { Contact } from '../../components/ContactList/Contact.jsx';
import { ContactForm } from '../../components/ContactList/ContactForm.jsx';
import { searchContext } from '../Layout.jsx';
import { useAnimationContext } from '../../hooks/useAnimationContext.jsx';
import useGlobalReducer from '../../hooks/useContactsContex.jsx';
import { fetchContacts } from '../../action.js';
import { apiRequest } from '../../apiRequest.js';


export const ContactList = () => {
	const { animatingId, animationType } = useAnimationContext();
	const [searchTerm, setSearchTerm] = useContext(searchContext);
	const { store, dispatch } = useGlobalReducer();
	const [editValue, setEditValue] = useState();
	const { contacts, loading, error } = store;
	const user = "chanchitoFeliz"
	const host = "https://playground.4geeks.com/contact";

	const handleAddNew = () => {
		setEditValue({ method: "POST" });
	};

	const filteredContacts = contacts.filter(contact =>
		contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
		contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
		contact.address.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const createUserIfNotExist = async (host, user) => {
		const { ok, data } = await apiRequest(`${host}/agendas/${user}`, "POST");
		return { ok, data };
	};





	const fetchOrCreateContacts = async (dispatch, host, user) => {
		const response = await fetchContacts(dispatch, host, user);
		if (response && response.status === 404) {
			console.log(`Usuario ${user} no existe, creando...`);
			await createUserIfNotExist(host, user);
			await fetchContacts(dispatch, host, user);
		}
	};

	useEffect(() => {
		fetchOrCreateContacts(dispatch, host, user);
	}, [dispatch]);

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
				<div className="text-center">
					<div className="spinner-border text-warning mb-4" role="status" style={{ width: "4rem", height: "4rem" }}>
						<span className="visually-hidden">Loading...</span>
					</div>

					<h3 className="section-title mt-3">
						<i className="fas fa-jedi me-2"></i>
						Loading contacts
					</h3>

					<p className="section-subtitle">
						Did you know? Han Solo's ship, the Millennium Falcon, made the Kessel Run in less than 12 parsecs!
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
				<div className="text-center no-results">
					<i className="fas fa-exclamation-triangle fa-3x mb-3"></i>

					<h3>Something went wrong</h3>

					<p>
						We couldn’t retrieve your contacts from the galaxy.<br />
						Error code: <strong>{error}</strong>
					</p>
				</div>
			</div>
		);
	}



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

			<ContactForm editValue={editValue} setEditValue={setEditValue} />

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
								setEditValue={setEditValue}
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
