import { Link, NavLink, useNavigate } from "react-router-dom";
import React, { useContext } from 'react';
import { searchContext } from "../pages/Layout";

export const Navbar = ({ activeSection, onSectionChange }) => {
	const handleClick = (e, section) => {
		e.preventDefault();
		onSectionChange(section);
	};
	const [searchTerm, setSearchTerm] = useContext(searchContext);

	return (
		<nav className="navbar navbar-expand-lg navbar-dark star-wars-navbar sticky-top">
			<div className="container">
				<Link
					className="navbar-brand border-0 bg-transparent"
					to={"/"}
					style={{ cursor: 'pointer' }}
				>
					<i className="fas fa-star-of-life me-2"></i>
					STAR WARS DATABASE
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav me-auto">

						<li className="nav-item">
							<NavLink
								to={"/people"}
								className={`nav-link border-0 bg-transparent ${activeSection === 'people' ? 'active' : ''}`}
								style={{ cursor: 'pointer' }}
							>
								<i className="fas fa-users me-2"></i>
								People
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink
								to={"/vehicles"}
								className={`nav-link border-0 bg-transparent ${activeSection === 'vehicles' ? 'active' : ''}`}
								style={{ cursor: 'pointer' }}
							>
								<i className="fas fa-rocket me-2"></i>
								Vehicles
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink
								to={"/planets"}
								className={`nav-link border-0 bg-transparent ${activeSection === 'planets' ? 'active' : ''}`}
								style={{ cursor: 'pointer' }}
							>
								<i className="fas fa-globe me-2"></i>
								Planets
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink
								to={"/favorites"}
								className={`nav-link border-0 bg-transparent ${activeSection === 'favorites' ? 'active' : ''}`}
								style={{ cursor: 'pointer' }}
							>
								<i className="fas fa-heart me-2"></i>
								Favorites
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink
								to={"/contacts"}
								className={`nav-link border-0 bg-transparent ${activeSection === 'contacts' ? 'active' : ''}`}
								style={{ cursor: 'pointer' }}
							>
								<i className="fas fa-address-book me-2"></i>
								Contact List
							</NavLink>
						</li>

					</ul>

					<div className="d-flex">
						<div className="search-container">
							<i className="fas fa-search search-icon"></i>
							<input
								type="text"
								className="form-control star-wars-search"
								placeholder="Search in galaxy..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

				</div>
			</div>
		</nav>
	);
};
