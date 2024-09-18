//para el tratamientod de fechas
import moment from 'moment';

//importamos hooks
import { useEffect, useState } from 'react';
import useOrders from '../hooks/useOrders';

//importamos forms
import { getProvinceByPostalcode } from '../utils';

//importamos funciones útiles
import OrderLinesForm from '../forms/OrderLinesForm';

const OrdersHeaderForm = () => {
    const [verMasDatos, setVerMasDatos] = useState([]);
    const { orders, ordersLoading, updateOrderCompleted, updateLineCompleted } =
        useOrders();

    useEffect(() => {
        if (orders) {
            const aux = Array(orders.length).fill(false);
            setVerMasDatos(aux);
        }
    }, [orders]);

    const toggleVerMasDatos = (index) => {
        const aux = [...verMasDatos];
        aux[index] = !aux[index];
        setVerMasDatos(aux);
    };

    const toggleType = (orderId) => {
        console.log(orderId);
        console.log(orders.find((order) => order.id == orderId));

        const oldType = orders.find((order) => order.id === orderId).type;

        updateOrderCompleted(
            orderId,
            oldType === 'p' ? 'a' : 'p',
            'orderHeader'
        );
    };

    if (ordersLoading) return <h2>Orders Loading...</h2>;
    if (!orders) return <h2>Orders Loading...</h2>;

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
                            <OrderLinesForm
                                order={order}
                                updateLineCompleted={updateLineCompleted}
                            />
                        </article>
                    </li>
                );
            })}
        </ul>
    );
};

export default OrdersHeaderForm;
