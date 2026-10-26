require('dotenv').config();

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('node:path');

const app = express();
const port = process.env.PORT || 4000;

const services = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    flights: process.env.FLIGHT_SERVICE_URL || 'http://localhost:3003',
    bookings: process.env.BOOKING_SERVICE_URL || 'http://localhost:3002',
    reminders: process.env.REMAINDER_SERVICE_URL || 'http://localhost:3005'
};

const routes = [
    [/^\/api\/v1\/(?:signup|signin|isAuthenticated|isAdmin|dummy)\/?$/, 'auth'],
    [/^\/api\/v1\/(?:city(?:\/\d+)?|cities|flights(?:\/\d+)?|airports)\/?$/, 'flights'],
    [/^\/api\/v1\/bookings\/?$/, 'bookings'],
    [/^\/api\/v1\/tickets\/?$/, 'reminders']
];

const proxies = Object.fromEntries(
    Object.entries(services).map(([name, target]) => [name, createProxyMiddleware({
        target,
        changeOrigin: true,
        on: {
            error(error, request, response) {
                if (response.headersSent) return;
                response.writeHead(502, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({
                    success: false,
                    message: `${name} service is unavailable`,
                    err: error.message
                }));
            }
        }
    })])
);

app.get('/health', (request, response) => {
    response.json({ success: true, service: 'api-gateway' });
});

app.use((request, response, next) => {
    if (!request.path.startsWith('/api/')) return next();

    const route = routes.find(([pattern]) => pattern.test(request.path));
    if (!route) {
        return response.status(404).json({
            success: false,
            message: 'No backend service is registered for this API route'
        });
    }

    return proxies[route[1]](request, response, next);
});

const frontendDirectory = path.resolve(__dirname, '../../../frontend/dist');
app.use(express.static(frontendDirectory));
app.get(/.*/, (request, response, next) => {
    response.sendFile(path.join(frontendDirectory, 'index.html'), (error) => {
        if (error) next(error);
    });
});

app.listen(port, '127.0.0.1', () => {
    console.log(`Air Ticket is available at http://localhost:${port}`);
});