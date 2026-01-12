import { apiRequest } from "./apiRequest";

const user = "chanchitoFeliz"
const host = "https://playground.4geeks.com/contact";

export const getContacts = async (setContacts) => {
    const response = await apiRequest(`${host}/agendas/${user}`, "GET", { notFoundText: `el usuario ${user} no existe, porfavor cree un nuevo usuario` })
    if (!response.ok) {
        const { status } = response
        if (status === 404) {
            console.log("No existe el usuario")
            return
        }
    }
    const { data: { contacts, slug } } = response
    setContacts(contacts);
}