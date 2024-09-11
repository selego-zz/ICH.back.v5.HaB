// importamos los hooks
import { useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

//importamos el token desde el contexto
import { AuthContext } from '../../contexts/AuthContext';

// importamos toast
import toast from 'react-hot-toast';

//importamos la dirección de la api
const { VITE_API_URL } = import.meta.env;

const LoginPage = () => {
    // tomamos el usuario, pero solo lo vamos a usar para decidir que mostramos en la página (si estamos logueados, no debemos poder loguearnos nuevamoente)
    //tomamos authLogin de contexto, para poner el token si la solicitud fue exitosa
    const { authLogin, authUser } = useContext(AuthContext);

    //variables para tomar los datos de email y password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //variable para deshabilitar el botón de aceptar mientras carga
    const [loginLoading, setLoginLoading] = useState(false);

    //importamos la función navigate
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        try {
            //prevenimos el comportamiento por defecto
            e.preventDefault();

            //impedimos nuevas llamadas a handleLogin
            setLoginLoading(true);

            //pedimos la información al servidor
            const res = await fetch(`${VITE_API_URL}/api/users/login`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const body = await res.json();

            if (body.status.toLowerCase() === 'error')
                throw new Error(body.message);

            authLogin(body.data);
            navigate('/');
        } catch (err) {
            toast.error(err.message, { id: 'login' });
        } finally {
            setLoginLoading(false);
        }
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
                <button disabled={loginLoading}>Aceptar</button>
            </form>
        </main>
    );
};
export default LoginPage;
