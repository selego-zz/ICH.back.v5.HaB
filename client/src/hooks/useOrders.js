// importamos los hooks
import { useContext, useEffect, useState } from 'react';

//importamos los context
import { AuthContext } from '../contexts/AuthContext';

//importamos toast
import toast from 'react-hot-toast';

//importamos las variables de entorno
const { VITE_API_URL } = import.meta.env;

const useOrders = () => {
    const { authToken } = useContext(AuthContext);

    /**
     * La variable de estado `orders` tiene tdos los campos de la tabla invoice_headers e invoice_lines, solo describo los más pertinentes:
     * @type {Array<{
     *   id: number, // Corresponde al id de la cabecera
     *   type: 'a' | 'f' | 'f', // tipo referido al pedido en conjunto
     *   number: string,
     *   client_number: string, // corresponde al número de pedido que nos ha solicitado el cliente que incluyamos como referenccia en el pedido
     *   client_id: number,
     *   agent_id number,
     *   packages number,
     *   observations string,
     *   modifiedAt Date, // usaremos esto para saber si corresponde con el pedido que tenemos
     *   lines Array<{
     *     id: number,
     *     line: number, //número de línea de la línea
     *     type 'a' | 'f' | 'f', // tipo de la línea específica
     *      reference string,
     *      name string,
     *      description string,
     *      format string,
     *      ordered_units number,
     *      served_units number,
     *      adr_text string,
     *      modifiedAt Date, // usaremos esto para saber si corresponde con el pedido que tenemos
     *    }>
     * }>}
     */
    const [orders, setOrders] = useState();
    const [ordersLoading, setOrdersLoading] = useState(false);

    useEffect(() => {
        //queremos que cada vez que cambie el token haga un fetch de los productos que el usuario puede ver

        /**
         * Función solicita a la API la información de todos los pedidos.
         * @description - Solicita a la API la información de todos los pedidos, y la almacena en la variable de estado orders.
         */
        const fetchOrders = async () => {
            setOrdersLoading(true);

            try {
                const res = await fetch(`${VITE_API_URL}/api/warehouse/p`, {
                    headers: {
                        Authorization: authToken,
                    },
                });

                const body = await res.json();

                if (body.status === 'error') throw new Error(body.message);
                if (!compareOrders(body.data)) setOrders(body.data);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setOrdersLoading(false);
            }
        };

        /**
         * Función que compara un array de pedidos con el que se encuentra en el state.
         * @param {Object[]} newOrders - Array de JSON que se quiere comparar con los pedidos de la variable orders del state
         * @description - Compara un array de pedidos con el que se encuentra en el state, tanto las cabeceras como cada una de sus líneas, basándose en el campo modifiedAt.
         * @returns - Devuelve un valor booleano: Si hay algún cambio en las cabeceras o las líneas devuelve false
         */
        const compareOrders = (newOrders) => {
            if (!orders) return false;
            if (orders?.length !== newOrders?.length) return false;
            for (const order of orders) {
                //para cada pedido del state
                //buscamos un pedido con id equivalente en new orders. si no lo hay, devolvemos false
                const newOrder = newOrders.find(
                    (newOrder) => newOrder.id === order.id
                );
                if (!newOrder) return false;

                // si el pedido de newOrders tiene una fecha de modificación distinta, devolvemos false
                if (order.modifiedAt !== newOrder.modifiedAt) return false;

                //en este punto las cabeceras son iguales. comprobamos las líneas con el mismo algoritmo

                if (order?.lines?.length !== newOrder?.lines?.length)
                    return false;
                for (const line of order.lines) {
                    const newLine = newOrder.lines.find(
                        (newLine) => newLine.id === line.id
                    );
                    if (!newLine) return false;

                    // si el pedido de newOrders tiene una fecha de modificación distinta, devolvemos false
                    if (line.modifiedAt !== newLine.modifiedAt) return false;
                }
            }

            return true;
        };

        fetchOrders();
    }, [authToken, orders]);

    const updateLineCompleted = async (orderId, lineId, completed, toastId) => {
        setOrdersLoading(true);

        try {
            const order = orders.find((order) => order.id === orderId);
            const line = order.lines.find((line) => line.id === lineId);

            const res = await fetch(
                `${VITE_API_URL}/api/warehouse/changeCompleted/${order.type}/${order.series}/${order.number}/${line.line}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: authToken,
                    },
                    body: JSON.stringify({ completed: completed }),
                }
            );

            const body = await res.json();

            if (body.status === 'error') throw new Error(body.message);
            setOrders(
                orders.map((order) => {
                    if (order.id !== orderId) return order;
                    //hasta aquí ha devuelto todos los pedidos menos el de la línea modificada.
                    return {
                        ...order,
                        lines: order.lines.map((line) => {
                            if (line.id !== lineId) return line;
                            return { ...line, completed: completed };
                        }),
                    };
                })
            );

            toast.success(body.message, { id: toastId });
        } catch (err) {
            toast.error(err.message, { id: toastId });
        } finally {
            setOrdersLoading(false);
        }
    };

    return { orders, ordersLoading, updateLineCompleted };
};

export default useOrders;
