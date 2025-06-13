import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const token = localStorage.getItem("access_token"); // Corrigido aqui
    return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
