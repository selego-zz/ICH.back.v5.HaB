//para el tratamientod de fechas
import moment from 'moment';

//importamos hooks
import { useContext, useEffect, useState } from 'react';
import useOrders from '../../hooks/useOrders';

//importamos forms
import { getProvinceByPostalcode } from '../../utils';

//importamos funciones útiles
import OrderLinesForm from '../../forms/OrderLinesForm';
import { AuthContext } from '../../contexts/AuthContext';

const OrdersPage = () => {
    const [mostrarPedido, setMostrarPedido] = useState([]);
    const [verMasDatos, setVerMasDatos] = useState([]);
    const { orders, ordersLoading, updateOrderCompleted, updateLineCompleted } =
        useOrders();
    const { authUser } = useContext(AuthContext);

    useEffect(() => {
        if (orders) {
            const aux = Array(orders.length).fill(false);
            setVerMasDatos(aux);
            setMostrarPedido(aux);
        }
    }, [orders]);

    const toggleVerMasDatos = (index) => {
        const aux = [...verMasDatos];
        aux[index] = !aux[index];
        setVerMasDatos(aux);
    };
    const toggleOcultarPedido = (index) => {
        const aux = [...mostrarPedido];
        aux[index] = !aux[index];
        setMostrarPedido(aux);
    };

    const toggleType = (orderId) => {
        const oldType = orders.find((order) => order.id === orderId).type;

        updateOrderCompleted(
            orderId,
            oldType === 'p' ? 'a' : 'p',
            'orderHeader'
        );
    };

    if (ordersLoading) return <h2>Orders Loading...</h2>;
    if (!orders) return <h2>Orders Loading...</h2>;
    if (orders.length < 1)
        return (
            <h2>
                No se han encontrado pedidos pendientes de {authUser.username}
            </h2>
        );

    return (
        <ul className="pedidos_pendientes">
            {orders?.map((order, index) => {
                return (
                    <li key={order.id}>
                        <article
                            className={
                                order.type === 'p'
                                    ? 'pedidoPendiente'
                                    : 'albaranGenerado'
                            }
                        >
                            <header>
                                <section className="order_data">
                                    {`Pedido: ${order.type.toUpperCase()},  ${
                                        order.series
                                    }, ${order.number}, ${
                                        order.number
                                    }, ${moment(order.delivery_date).format(
                                        'DD/MM/YYYY'
                                    )}`}
                                    <button
                                        onClick={() => {
                                            toggleVerMasDatos(index);
                                        }}
                                    >
                                        {verMasDatos[index]
                                            ? 'Menos datos'
                                            : 'Más datos'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            toggleOcultarPedido(index);
                                        }}
                                    >
                                        {mostrarPedido[index]
                                            ? 'Mostrar Pedido'
                                            : 'Ocultar Pedido'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            toggleType(order.id);
                                        }}
                                    >
                                        {order.type === 'p'
                                            ? 'Marcar para Envío'
                                            : 'Marcar como pendiente'}{' '}
                                    </button>
                                </section>
                                {verMasDatos[index] && (
                                    <section className="orderData">
                                        <ul>
                                            <li>{`Cliente: ${order.fiscal_name}`}</li>
                                            <li>{`Destino: ${
                                                order.shipping_city
                                            } (${getProvinceByPostalcode(
                                                order.shipping_postal_code
                                            )})`}</li>
                                            <li>{`Agente: ${order.username}`}</li>
                                        </ul>
                                    </section>
                                )}
                            </header>
                            {!mostrarPedido[index] && (
                                <OrderLinesForm
                                    order={order}
                                    updateLineCompleted={updateLineCompleted}
                                />
                            )}
                        </article>
                    </li>
                );
            })}
        </ul>
    );
};

export default OrdersPage;
