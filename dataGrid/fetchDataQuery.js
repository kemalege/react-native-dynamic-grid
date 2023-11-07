/* eslint-disable */



export async function fetchData(url, formData) {

  const options = {
    method: 'POST',
    body: formData
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error(error);
    return Promise.reject(error);
  }
}
