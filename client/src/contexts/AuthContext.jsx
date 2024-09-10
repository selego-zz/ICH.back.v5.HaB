//importamos las prop-types
import PropTypes from 'prop-types';

// importamos la función que crea un contexto, y los hooks
import { createContext, useState } from 'react';

//importamos la dirección donde guardar el token en local storage
const { VITE_AUTH_TOKEN } = import.meta.env;

/**
 * Contexto de autenticación
 * @description - Este contexto se crea para guardar, recuperar y eliminar el token
 * @type {React.Context}
 */
const AuthContext = createContext(null);

/**
 * Proveedor de autenticación (proveedor de token) que envuelve la aplicación y maneja el estado del token.
 * @param {Object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que serán envueltos por el proveedor.
 * @returns {JSX.Element} AuthContext.Provider - El proveedor de autenticación, que exportará las props authToken, authLogin, authLogout
 */
const AuthProvider = ({ children }) => {
  //declaramos la variable que manejará el token en el state.
  //intenamos cargar sus datos del Local Storage. Si no fuera posible, inicializamos a null
  const [authToken, setAuthToken] = useState(
    localStorage.getItem(VITE_AUTH_TOKEN) || null
  );

  /**
   * Función que guarda el token.
   * @description - Guarda el token de autenticación en el State, y en el local Storage
   * @param {string} token - El token de autenticación.
   */
  const authLogin = (token) => {
    //guardamos el token en el state
    setAuthToken(token);
    //guardamos el token en el local storage
    localStorage.setItem(VITE_AUTH_TOKEN, token);
  };

  /**
   * Función que elimina el token.
   * @description - Elimina el token de autenticación en el State, y en el local Storage
   */
  const authLogout = () => {
    //eliminamos el token en el state
    setAuthToken(null);
    //eliminamos el token en el local storage
    localStorage.removeItem(VITE_AUTH_TOKEN);
  };

  // devolvemos el proveedor de autenticación, que tenemos que poner en main, todo lo que envuelva tendrá acceso a este contexto
  return (
    <AuthContext.Provider value={{ authToken, authLogin, authLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

//validamos las props
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
