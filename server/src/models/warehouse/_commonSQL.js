const SQL_GET_ALL_HEADERS =
    'SELECT i.*, u.username FROM invoice_headers i, users u WHERE i.agent_id = u.id ';
const SQL_GET_LINE_ID = 'SELECT id FROM invoice_lines WHERE ';
export { SQL_GET_ALL_HEADERS, SQL_GET_LINE_ID };
