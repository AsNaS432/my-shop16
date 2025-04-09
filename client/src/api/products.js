import axios from 'axios';
// Updated base URL to point to the correct server endpoint
const API_URL = 'http://localhost:5000/api/products'; // Changed from mock API to server API

// Function to load products
export const fetchProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // Возвращаем данные товаров
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        throw error; // Пробрасываем ошибку, чтобы обработать её в компоненте
    }
};
