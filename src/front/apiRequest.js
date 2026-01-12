/**
 * Hace una petición a la API
 *
 * @param {string} uri
 * @param {string} metodo
 * @param {Object} [options]
 * @param {*} [options.body]
 * @param {string} [options.notFoundText]
 *
 * @returns {Promise<{
 *   ok: boolean,
 *   data?: any,
 *   status?: number,
 *   statusText?: string
 * }>}
 */


export const apiRequest = async (uri, metodo,
	{ body = null, notFoundText = null } = {}) => {
	const options = {
		method: metodo,
		headers: {
			"Content-Type": "application/json"
		}
	};

	if (body != null) {
		options.body = JSON.stringify(body)
	};

	const response = await fetch(uri, options);

	if (!response.ok) {
		const { ok, status, statusText } = response
		if (status === 404) return { ok, status, statusText, notFoundText };
		return { ok, status, statusText };
	}
	const text = await response.text();
	const data = text ? JSON.parse(text) : null;
	return { ok: true, data }
};
