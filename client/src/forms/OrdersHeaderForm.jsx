import moment from 'moment';

import { getProvinceByPostalcode } from '../utils';
import OrderLinesForm from '../forms/OrderLinesForm';
import useOrders from '../hooks/useOrders';

const OrdersHeaderForm = () => {
    const { orders, ordersLoading, updateLineCompleted } = useOrders();
    if (ordersLoading) return <h2>Orders Loading...</h2>;

    return (
        <ul className="pedidos_pendientes">
            {orders?.map((order) => {
                return (
                    <li key={order.id}>
                        <article>
                            <header>
                                <section className="order_data">
                                    {`Pedido: ${order.type.toUpperCase()},  ${
                                        order.series
                                    }, ${order.number}, ${
                                        order.number
                                    }, ${moment(order.delivery_date).format(
                                        'DD/MM/YYYY'
                                    )}`}
                                </section>
                                <section className="client">
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
