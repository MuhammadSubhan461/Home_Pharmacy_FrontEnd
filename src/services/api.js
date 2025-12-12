import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  adminLogin: (credentials) => api.post('/admin/login', credentials),
  createAdmin: (adminData) => api.post('/admin/create-admin', adminData),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
  getCategories: () => api.get('/products/categories'),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => {
    // If orderData is FormData (for file uploads), let browser set Content-Type
    const config = orderData instanceof FormData ? {
      headers: {
        'Content-Type': undefined
      }
    } : {};
    return api.post('/orders', orderData, config);
  },
  getMyOrders: (params) => api.get('/orders/myorders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, statusData) => api.put(`/admin/users/${id}`, statusData),
  getAllProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, statusData) => api.put(`/admin/orders/${id}/status`, statusData),
};

// Health check
export const healthAPI = {
  checkHealth: () => api.get('/health'),
};

export default api;
