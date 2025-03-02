import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        email: localStorage.getItem("email") || "",
        role: localStorage.getItem("role") || "",
    });

    useEffect(() => {
        localStorage.setItem("email", auth.email);
        localStorage.setItem("role", auth.role);
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
