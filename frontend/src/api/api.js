import axios from "axios";

// 🔹 Cria uma instância do Axios configurada
const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // URL do seu backend Django
});

// 🔹 Intercepta todas as requisições para adicionar o token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      const { accessToken } = JSON.parse(userData);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
