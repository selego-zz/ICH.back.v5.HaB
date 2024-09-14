import PropTypes from 'prop-types';
import { useState } from 'react';
import toast from 'react-hot-toast';

const DeleteUserForm = ({ users, deleteUser }) => {
    const [userId, setUserId] = useState('');

    const handleDeleteUser = async (e) => {
        try {
            e.preventDefault();
            if (
                !confirm(
                    `¿Está seguro de que desea eliminar a ${
                        users.find((user) => user.id == userId).username
                    }?`
                )
            )
                return;

            await deleteUser(userId);
        } catch (err) {
            toast.error(err.message, { id: 'deleteUserForm' });
        }
    };
    return (
        <main>
            <h2>Eliminar usuario</h2>;
            <form onSubmit={handleDeleteUser}>
                <label htmlFor="userId"></label>
                <input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <button>Eliminar usuario</button>
            </form>
        </main>
    );
};

DeleteUserForm.propTypes = {
    deleteUser: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            username: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            code: PropTypes.string,
            role: PropTypes.oneOf([
                'administrador',
                'empleado',
                'cliente',
                'comercial',
            ]).isRequired,
            avatar: PropTypes.string,
            createdAt: PropTypes.string.isRequired,
            modifiedAt: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default DeleteUserForm;
