import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { ContactListLayout } from "./pages/ContactList/ContactListLayout.jsx";
import { People } from "./pages/People/People.jsx";
import { Vehicles } from "./pages/Vehicles/Vehicles.jsx";
import { Planets } from "./pages/Planets/Planets.jsx";
import { Favorites } from "./pages/Favorites.jsx";
import { DetailView } from "./pages/DetailView.jsx";
import { Login } from "./pages/Login.jsx";
import { ContactDetails } from "./pages/ContactList/ContactDetails.jsx";

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
			<Route path="/" element={<Home />} />
			<Route path="/people" element={<People />} />
			<Route path="/people/:people_id" element={<DetailView />} />

			<Route path="/vehicles" element={<Vehicles />} />
			<Route path="/vehicles/:vehicle_id" element={<DetailView />} />

			<Route path="/planets" element={<Planets />} />
			<Route path="/planets/:planet_id" element={<DetailView />} />

			<Route path="/favorites" element={<Favorites />} />

			<Route path="/contacts" element={<ContactListLayout />} />
			<Route path="/contacts/details" element={<ContactDetails />} />

			<Route path="/login" element={<Login />} />
		</Route>
	),
	{
		/* Activa estas flags para eliminar los avisos de la consola */
		future: {
			v7_startTransition: true,
			v7_relativeSplatPath: true,
			v7_fetcherPersist: true,
			v7_normalizeFormMethod: true,
			v7_partialHydration: true,
			v7_skipActionErrorRevalidation: true,
		},
	}
);
