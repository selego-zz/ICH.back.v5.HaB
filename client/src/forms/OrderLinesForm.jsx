import PropTypes from 'prop-types';
const OrderLinesForm = ({ order, updateLineCompleted }) => {
    if (!order) return <></>;

    return (
        <section className="order_lines">
            <ul>
                {order.lines.map((line) => {
                    return (
                        <li
                            key={line.id}
                            className={
                                line.completed == true
                                    ? 'completo'
                                    : 'pendiente'
                            }
                        >
                            <ul className="orderLine">
                                <li>
                                    <input
                                        type="checkbox"
                                        defaultChecked={line.completed}
                                        onClick={() => {
                                            updateLineCompleted(
                                                order.id,
                                                line.id,
                                                !line.completed,
                                                'OrderLines'
                                            ); //(orderId, lineId, completed, toastId)
                                        }}
                                    />
                                </li>
                                <li>{line.reference}</li>
                                <li>{line.name}</li>
                                <li>{line.description}</li>
                                <li>{line.format}</li>
                                <li>{line.ordered_units}</li>
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

OrderLinesForm.propTypes = {
    order: PropTypes.object.isRequired,
    updateLineCompleted: PropTypes.func.isRequired,
};

export default OrderLinesForm;
