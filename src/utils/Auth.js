export const BASE_URL = 'https://auth.nomoreparties.co';
const handleResponse = (response) => {
    if (!response.ok) {
      return response.json().then((err) => {
        const error = new Error('Ошибка сервера');
        error.data = err;
        throw error;
      });
    }
    return response.json();
  }
  
export const registration = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(handleResponse)
    .then((data) => {
      return data.data;
    });
};
export const authorization = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({email, password })
    })
    .then(handleResponse)
    .then((data) => {
      return data.token;
    });
};


export const getContent = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => data)
} 
