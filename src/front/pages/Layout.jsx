import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { createContext, useEffect, useState } from "react"
import { ContactList } from './ContactList/ContactList'
import { People } from "./People/People"
import { Vehicles } from "./Vehicles/Vehicles"
import { Planets } from "./Planets/Planets"

export const searchContext = createContext()
// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const [searchTerm, setSearchTerm] = useState('');



    return (
        <ScrollToTop>
            <searchContext.Provider value={[searchTerm, setSearchTerm]}>
                <Navbar />
                <main>
                    <Outlet />
                </main>
                <Footer />
            </searchContext.Provider>
        </ScrollToTop>
    )
}