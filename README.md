# Air Ticket

All backend code lives in `backend/`: four services and the API gateway. The microservice source files are included directly in this repository, so they are visible when browsing it on GitHub. The React/Vite client stays at the project root. The gateway serves the built client and proxies API requests, so the only browser address is `http://localhost:4000`. Backend services bind to loopback and are reached internally by the gateway or BookingService.

## Start locally

Install the gateway, frontend, and root process runner from the project root:

```powershell
npm install
```

Install dependencies for the four backend services once each:

```powershell
Push-Location backend/AuthService; npm install; Pop-Location
Push-Location backend/FlightAndSearch; npm install; Pop-Location
Push-Location backend/BookingService; npm install; Pop-Location
Push-Location backend/RemainderService; npm install; Pop-Location
```

Create the required service database configuration and `.env` files before starting the backend. AuthService, FlightAndSearch, and BookingService each need their configured MySQL database and migrations. AuthService also requires `JWT_KEY`.

Run the client, gateway, and all backend services from this directory:

```powershell
npm run dev
```

Open `http://localhost:4000`. The gateway reports readiness at `http://localhost:4000/health`.

## Service ports

| Component | Default port |
| --- | ---: |
| AuthService | 3001 |
| BookingService | 3002 |
| FlightAndSearch | 3003 |
| RemainderService | 3005 |
| API Gateway and React client | 4000 |

Override gateway targets with `AUTH_SERVICE_URL`, `FLIGHT_SERVICE_URL`, `BOOKING_SERVICE_URL`, and `REMAINDER_SERVICE_URL`. BookingService uses `FLIGHT_SERVICE_URL` for its direct flight-service call; its default is `http://localhost:3003`.

The React development server can still be run separately with `npm run dev --workspace=air-ticket-frontend` when hot reload is needed; that optional mode uses port 5173.

To add sample flights for every date from October 25 through November 5, 2026, first seed the airports and airplanes, then run this from the project root:

```powershell
Push-Location backend/FlightAndSearch; npm run seed:sample-flights; Pop-Location
```

This seeder can be run again safely; it adds any missing flights without duplicating existing sample flights. The frontend date search filters by the selected departure date.

## Gateway routes

The gateway preserves `/api/v1` and forwards authentication, flight/city/airport, booking, and reminder endpoints to their owning services. Unregistered API routes return a gateway 404; an unavailable upstream returns 502.