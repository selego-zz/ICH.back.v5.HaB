const SQL_GET_ALL_HEADERS =
    'SELECT i.*, u.username FROM invoice_headers i, users u WHERE i.agent_id = u.id ';
const SQL_GET_LINE_ID = 'SELECT id FROM invoice_lines WHERE ';

const SQL_GET_ORDERS_CLIENT = 'SELECT client_id FROM invoice_headers WHERE';
const SQL_GET_ORDERS_AGENT = 'SELECT agent_id FROM invoice_headers WHERE';

export {
    SQL_GET_ALL_HEADERS,
    SQL_GET_LINE_ID,
    SQL_GET_ORDERS_CLIENT,
    SQL_GET_ORDERS_AGENT,
};
