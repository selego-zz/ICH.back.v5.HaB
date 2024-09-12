import { useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

const AddUserForm = ({ addUser }) => {
    const [username, setUsermame] = useState('');
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');

    const [code, setCode] = useState('');
    const [role, setRole] = useState('cliente   ');

    const handleAddUser = async (e) => {
        try {
            e.preventDefault();

            if (!confirm('¿Está seguro de que desea insertar el usuario?'))
                return;
            if (password !== repeatedPassword)
                throw new Error('Las contraseñas no coinciden');

            await addUser({ username, password, email, code, role });
            toast.success('Usuario Añadido', { id: 'AddUserForm' });
        } catch (err) {
            toast.error(err.message, { id: 'AddUserForm' });
        }
    };

    return (
        <form onSubmit={handleAddUser}>
            <h2>Añadir usuario</h2>;
            <label htmlFor="username">Nombre de usuario</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                    setUsermame(e.target.value);
                }}
                required
            />
            <label htmlFor="email">Correo electrónico</label>
            <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
                required
            />
            <label htmlFor="password">Contraseña</label>
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
            <label htmlFor="code">Código</label>
            <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => {
                    setCode(e.target.value);
                }}
            />
            <label htmlFor="role">Rol</label>
            <select
                id="role"
                name="role"
                onChange={(e) => {
                    setRole(e.target.value);
                }}
            >
                <option value="cliente">cliente</option>
                <option value="comercial">comercial</option>
                <option value="empleado">empleado</option>
                <option value="administrador">administrador</option>
            </select>
            <button>Añadir Usuario</button>
        </form>
    );
};

AddUserForm.propTypes = {
    addUser: PropTypes.func.isRequired,
};

export default AddUserForm;
