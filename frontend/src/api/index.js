import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8081/api"
});

export const authAPI = {
    login: (data) => API.post("/auth/login", data),
    signup: (data) => API.post("/auth/signup", data)
};

export const transactionAPI = {
    getAll: () => API.get("/transactions"),
    create: (data) => API.post("/transactions", data),
    createBatch: (data) => API.post("/transactions/batch", data)
};