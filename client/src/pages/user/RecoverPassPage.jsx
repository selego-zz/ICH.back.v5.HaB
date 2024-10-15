import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const { VITE_API_URL } = import.meta.env;
const RecoverPassPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleRecoverPass = async (e) => {
        try {
            e.preventDefault();

            const res = await fetch(
                `${VITE_API_URL}/api/users/password/recover`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                }
            );

            if (res.status === 'error') throw new Error(res.message);
            console.log(res);

            toast.success(res.message);
            navigate('/');
        } catch (err) {
            toast.error(err.message);
        }

        // mandar a la api una solicitud de codigo de recuperación => crear ruta recuperación de contraseña
        // crear en base de datos-tabla usuarios un campo para guardarla
    };

    return (
        <main>
            <form onSubmit={handleRecoverPass}>
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
                <button>Aceptar</button>
            </form>
        </main>
    );
};
export default RecoverPassPage;
