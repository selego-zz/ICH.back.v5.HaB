import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const { VITE_API_URL } = import.meta.env;

const ResetPassPage = () => {
    const [recoveryCode, setRecoveryCode] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const { code } = useParams();

    useEffect(() => {
        const setCode = () => {
            setRecoveryCode(code);
        };
        setCode();
    }, [code]);

    const handleRecoverPass = async (e) => {
        try {
            e.preventDefault();

            if (password !== repeatedPassword) {
                throw new Error(
                    'Las contraseñas no coincien, por favor, introduce las contraseñas de nuevo'
                );
            }
            const res = await fetch(
                `${VITE_API_URL}/api/users/password/recover/${recoveryCode}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ password }),
                }
            );
            console.log(res);

            if (res.status === 'error') throw new Error(res.message);

            toast.success(res.message);
        } catch (err) {
            toast.error(err);
        }
    };

    if (recoveryCode.length < 1)
        return (
            <main>
                <h1>Página de recuperación de contraseña</h1>
                <h3>Código de recuperación incorrecto</h3>
                <p>
                    Por alguna razón, el código de recuperación que has
                    introducido no es correcto. Debes asegurate de que has
                    copiado bien el enlace, o solicita un nuevo código de
                    recuperación
                </p>
            </main>
        );

    return (
        <main>
            {' '}
            <h1>Página de recuperación de contraseña</h1>
            <p>
                Por favor, introduce a continuación la nueva contraseña, en las
                2 casillas donde puedes meter texto. Es importante que metas el
                mismo valor en ambas, para asegurarte de que has metido bien la
                contraseña
            </p>
            <form onSubmit={handleRecoverPass}>
                <label htmlFor="password">Nueva contraseña</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    required
                />
                <label htmlFor="repeatedPassword">Repite la contraseña</label>
                <input
                    type="password"
                    id="repeatedPassword"
                    value={repeatedPassword}
                    onChange={(e) => {
                        setRepeatedPassword(e.target.value);
                    }}
                    required
                />
                <button>Aceptar</button>
            </form>
        </main>
    );
};
export default ResetPassPage;
