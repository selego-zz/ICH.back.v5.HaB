// importamos los hooks
import { useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

//importamos el token desde el contexto
import { AuthContext } from '../../contexts/AuthContext';

const LoginPage = () => {
    // tomamos el usuario, pero solo lo vamos a usar para decidir que mostramos en la página (si estamos logueados, no debemos poder loguearnos nuevamoente)
    //tomamos authLogin de contexto, para poner el token si la solicitud fue exitosa
    const { authUser, authUserLoading, fetchNewToken } =
        useContext(AuthContext);

    //variables para tomar los datos de email y password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //importamos la función navigate
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        //prevenimos el comportamiento por defecto
        e.preventDefault();

        await fetchNewToken(email, password);

        //impedimos nuevas llamadas a handleLogin
        navigate('/');
    };

    //si el usuario ya está logueado, vamos a la página principal
    if (authUser) return <Navigate to="/user" />;

    return (
        <main>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Correo Electrónico</label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    required
                />

                <label htmlFor="pass">Password</label>
                <input
                    type="password"
                    id="pass"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    required
                />
                <button disabled={authUserLoading}>Aceptar</button>
            </form>
        </main>
    );
};
export default LoginPage;
