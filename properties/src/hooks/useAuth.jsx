// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null);
//   const [role, setRole] = useState(null);
//   const [username, setUsername] = useState(null);
//   const [loading, setLoading] = useState(true); // <-- new loading state

//   // Load saved auth from localStorage on app mount
//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     const savedRole = localStorage.getItem("role");
//     const savedUsername = localStorage.getItem("username");

//     if (savedToken && savedRole && savedUsername) {
//       setToken(savedToken);
//       setRole(savedRole);
//       setUsername(savedUsername);
//     }
//     setLoading(false); // done loading
//   }, []);

//   const saveAuth = (newToken, newRole, newUsername) => {
//     setToken(newToken);
//     setRole(newRole);
//     setUsername(newUsername);

//     localStorage.setItem("token", newToken);
//     localStorage.setItem("role", newRole);
//     localStorage.setItem("username", newUsername);
//   };

//   const logOut = () => {
//     setToken(null);
//     setRole(null);
//     setUsername(null);

//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("username");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ token, role, username, saveAuth, logOut, loading }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // install this with `npm install jwt-decode`

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedUsername = localStorage.getItem("username");

    if (savedToken && savedRole && savedUsername) {
      const decoded = jwtDecode(savedToken);
      const isExpired = decoded.exp * 1000 < Date.now(); // exp is in seconds

      if (!isExpired) {
        setToken(savedToken);
        setRole(savedRole);
        setUsername(savedUsername);
      } else {
        clearAuth(); // clear if expired
      }
    }
    setLoading(false);
  }, []);

  const saveAuth = (newToken, newRole, newUsername) => {
    setToken(newToken);
    setRole(newRole);
    setUsername(newUsername);

    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("username", newUsername);

    // ⏰ Automatically clear when expired
    const decoded = jwtDecode(newToken);
    const expiresIn = decoded.exp * 1000 - Date.now();
    setTimeout(() => clearAuth(), expiresIn);
  };

  const clearAuth = () => {
    setToken(null);
    setRole(null);
    setUsername(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider
      value={{ token, role, username, saveAuth, logOut: clearAuth, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
