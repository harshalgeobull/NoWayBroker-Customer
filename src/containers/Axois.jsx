import axios from 'axios';


const API_URL = 'http://localhost:8000/api/properties/';

export const fetchProperties = async () => {
    try {
        const token = localStorage.getItem('token'); // Fetch the JWT token from localStorage
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`, // Include the JWT token in the headers
                'X-CSRFToken': getCookie('csrftoken'), // Include CSRF token if required
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching properties", error);
        throw error;
    }
};

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
