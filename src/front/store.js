import { People } from './pages/People/People.jsx'
export const initialStore = () => {
	return {
		"slug": "chanchitoFeliz",
		"contacts": []
	}
}


const CRUD = {
	update_contact: (state, action) => {
		return { ...state, contacts: action.payload }
	},
}

export default function storeReducer(store, action = {}) {
	return (CRUD[action.type] || (() => store))(store, action)
}
