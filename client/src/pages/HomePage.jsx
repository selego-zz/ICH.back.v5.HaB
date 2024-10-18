//importamos el contexto
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import OrdersPage from './warehouse/OrdersPage';

const HomePage = () => {
    const { authUser } = useContext(AuthContext);

    if (!authUser) return <h2>User Loading...</h2>;
    return (
        <main>
            <h2>Pedidos Pendientes</h2>
            <OrdersPage />
        </main>
    );
};

export default HomePage;
