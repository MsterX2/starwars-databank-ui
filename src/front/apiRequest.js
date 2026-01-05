export const apiRequest = async (uri, metodo, body = null) => {
  const options = {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
    },
    body: body && JSON.stringify(body),
  };
  const response = await fetch(uri, options);
  if (response.status === 404) {
    alert("Un hijo de su madre te borro la cuenta :(");
    return response;
  }
  if (!response.ok) {
    console.log("dio un error", response.status, response.statusText);
  }
  if (response.ok && metodo === "GET") return await response.json();
};
