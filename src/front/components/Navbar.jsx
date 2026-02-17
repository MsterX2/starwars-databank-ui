import { Link, NavLink, useNavigate } from "react-router-dom";
import React, { useContext } from 'react';
import { searchContext } from "../pages/Layout";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = ({ activeSection, onSectionChange }) => {
	const navigate = useNavigate();
	const handleClick = (e, section) => {
		e.preventDefault();
		onSectionChange(section);
	};
	const [searchTerm, setSearchTerm] = useContext(searchContext);
	const { store, dispatch } = useGlobalReducer()

	const handleLogout = () => {
		localStorage.removeItem("access_token");
		dispatch({ type: "LOGOUT" });
		dispatch({ type: "HANDLE_TOKEN", payload: "" })
		localStorage.removeItem("access_token")
		navigate("/");
	};

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
						{store.isAuthenticated ?
							<>
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
							</> :
							null
						}
					</ul>

					<div className="d-flex align-items-center gap-2">
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

						{store.isAuthenticated ? (
							<div className="auth-buttons-container d-flex align-items-center gap-2">
								<span className="navbar-user-name d-none d-md-inline">
									<i className="fas fa-jedi me-1"></i>
									{store.user?.first_name || store.user?.email || 'User'}
								</span>
								<button
									className="btn star-wars-button-secondary navbar-auth-btn"
									onClick={handleLogout}
									title="Logout"
								>
									<i className="fas fa-sign-out-alt"></i>
									<span className="d-none d-lg-inline ms-1">Logout</span>
								</button>
							</div>
						) : (
							<div className="auth-buttons-container d-flex align-items-center gap-2">
								<Link
									to="/login"
									className="btn star-wars-button-secondary navbar-auth-btn"
									title="Login"
								>
									<i className="fas fa-user"></i>
									<span className="d-none d-lg-inline ms-1">Login</span>
								</Link>
								<Link
									to="/login"
									className="btn star-wars-button navbar-auth-btn"
									title="Sign Up"
								>
									<i className="fas fa-user-plus"></i>
									<span className="d-none d-lg-inline ms-1">Sign Up</span>
								</Link>
							</div>
						)}
					</div>

				</div>
			</div>
		</nav>
	);
};
