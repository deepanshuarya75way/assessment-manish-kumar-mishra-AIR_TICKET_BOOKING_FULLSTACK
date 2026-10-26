import { useEffect, useMemo, useState } from 'react';

const API = '/api/v1';

function locationName(flight, side) {
  const airport = flight[side];
  return airport?.City?.name || airport?.name || `Airport ${flight[`${side === 'departureAirport' ? 'departure' : 'arrival'}AirportId`]}`;
}

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.token ? { 'x-access-token': options.token } : {}),
      ...options.headers
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `Request failed (${response.status})`);
  }
  return payload;
}

function App() {
  const [flights, setFlights] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(true);
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem('air-ticket-token') || '');
  const [userId, setUserId] = useState('');
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [bookingFlight, setBookingFlight] = useState(null);
  const [seats, setSeats] = useState(1);

  async function loadFlights() {
    setLoadingFlights(true);
    try {
      const result = await request('/flights');
      setFlights(Array.isArray(result.data) ? result.data : []);
      setError('');
    } catch (problem) {
      setError(problem.message);
    } finally {
      setLoadingFlights(false);
    }
  }

  useEffect(() => {
    loadFlights();
  }, []);

  useEffect(() => {
    if (!token) {
      setUserId('');
      return;
    }
    request('/isAuthenticated', { token })
      .then((result) => setUserId(result.data))
      .catch(() => {
        localStorage.removeItem('air-ticket-token');
        setToken('');
        setUserId('');
      });
  }, [token]);

  const visibleFlights = useMemo(() => flights.filter((flight) => {
    const matchesDeparture = !departure || `${locationName(flight, 'departureAirport')} ${flight.departureAirport?.name || ''}`.toLowerCase().includes(departure.trim().toLowerCase());
    const matchesArrival = !arrival || `${locationName(flight, 'arrivalAirport')} ${flight.arrivalAirport?.name || ''}`.toLowerCase().includes(arrival.trim().toLowerCase());
    const matchesDate = !travelDate || String(flight.departureTime).slice(0, 10) === travelDate;
    return matchesDeparture && matchesArrival && matchesDate;
  }), [flights, departure, arrival, travelDate]);

  async function submitAuth(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (authMode === 'signup') {
        await request('/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
        setAuthMode('signin');
        setNotice('Account created. Sign in to continue.');
      } else {
        const result = await request('/signin', { method: 'POST', body: JSON.stringify({ email, password }) });
        localStorage.setItem('air-ticket-token', result.data);
        setToken(result.data);
        setPassword('');
        setNotice('Signed in. You can now book a flight.');
      }
    } catch (problem) {
      setError(problem.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitBooking(event) {
    event.preventDefault();
    if (!userId) {
      setError('Sign in before booking a flight.');
      setBookingFlight(null);
      return;
    }
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await request('/bookings', {
        method: 'POST',
        body: JSON.stringify({ flightId: bookingFlight.id, userId, noOfSeats: Number(seats) })
      });
      setNotice(`Booking ${result.data.id} confirmed for ${seats} seat${Number(seats) === 1 ? '' : 's'}.`);
      setBookingFlight(null);
      await loadFlights();
    } catch (problem) {
      setError(problem.message);
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    localStorage.removeItem('air-ticket-token');
    setToken('');
    setUserId('');
    setNotice('You have signed out.');
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Air Ticket home">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>air<span className="brand-light">ticket</span></span>
        </a>
        <div className="topbar-right">
          <span className="gateway-state"><i /> API gateway connected</span>
          {token ? <button className="text-button" onClick={signOut}>Sign out</button> : <a className="text-button" href="#account">Your account</a>}
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A better way to get there</p>
          <h1>Make room<br />for <em>somewhere</em> new.</h1>
          <p className="hero-note">Find a flight worth looking forward to.</p>
        </div>
        <div className="hero-image" role="img" aria-label="Passenger airplane above the clouds">
          <span className="image-caption">THE WORLD, WITHIN REACH</span>
        </div>
      </section>

      <section className="search-panel" aria-label="Search flights">
        <div className="search-heading">
          <div><span className="section-kicker">01 / FIND YOUR FLIGHT</span><h2>Where to next?</h2></div>
          <button className="refresh-button" onClick={loadFlights} title="Refresh flights" aria-label="Refresh flights">↻</button>
        </div>
        <div className="search-fields">
          <label>FROM <input placeholder="City or airport" value={departure} onChange={(event) => setDeparture(event.target.value)} /></label>
          <span className="route-arrow" aria-hidden="true">→</span>
          <label>TO <input placeholder="City or airport" value={arrival} onChange={(event) => setArrival(event.target.value)} /></label>
          <label className="date-field">DATE <input type="date" value={travelDate} onChange={(event) => { setTravelDate(event.target.value); loadFlights(); }} /></label>
        </div>
        <div className="results-heading">
          <h3>Available flights <span>{visibleFlights.length.toString().padStart(2, '0')}</span></h3>
          <span className="results-meta">Prices shown per passenger</span>
        </div>
        {loadingFlights ? <p className="empty-state">Loading available flights…</p> : visibleFlights.length ? (
          <div className="flight-list">
            {visibleFlights.map((flight) => (
              <article className="flight-row" key={flight.id}>
                <div className="flight-ident"><span className="plane-icon" aria-hidden="true">✈</span><div><strong>{flight.flightNumber}</strong><small>{flight.totalSeats} seats remaining</small></div></div>
                <div className="flight-time"><strong>{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong><small title={flight.departureAirport?.name}>{locationName(flight, 'departureAirport')}</small></div>
                <div className="flight-duration"><span /> <small>DIRECT</small></div>
                <div className="flight-time"><strong>{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong><small title={flight.arrivalAirport?.name}>{locationName(flight, 'arrivalAirport')}</small></div>
                <div className="flight-price"><strong>${Number(flight.price).toLocaleString()}</strong><button disabled={!flight.totalSeats} onClick={() => { setBookingFlight(flight); setSeats(1); }}>Select</button></div>
              </article>
            ))}
          </div>
        ) : <p className="empty-state">No flights match those details. Try another airport or date.</p>}
      </section>

      <section className="account-section" id="account">
        <div className="account-copy">
          <span className="section-kicker">02 / YOUR JOURNEY</span>
          <h2>{token ? 'Ready when you are.' : 'The next trip starts here.'}</h2>
          <p>{token ? 'Your account is connected. Select a flight above to continue.' : 'Sign in to reserve your seat and keep your plans together.'}</p>
        </div>
        {token ? <div className="signed-in"><span className="checkmark">✓</span><div><strong>Signed in</strong><small>Account ID {userId || 'checking…'}</small></div></div> : (
          <form className="auth-form" onSubmit={submitAuth}>
            <div className="auth-tabs" role="tablist" aria-label="Account access">
              <button type="button" className={authMode === 'signin' ? 'active' : ''} onClick={() => setAuthMode('signin')}>Sign in</button>
              <button type="button" className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>Create account</button>
            </div>
            <label className="visually-hidden" htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label className="visually-hidden" htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button className="submit-button" disabled={busy}>{busy ? 'Please wait…' : authMode === 'signup' ? 'Create account' : 'Sign in'} <span aria-hidden="true">↗</span></button>
          </form>
        )}
      </section>

      <footer><span>© 2026 Air Ticket</span><span>Flights that take you further.</span><span>All services · one gateway</span></footer>

      {(notice || error) && <div className={`toast ${error ? 'toast-error' : ''}`} role="status"><span>{error || notice}</span><button onClick={() => { setNotice(''); setError(''); }} aria-label="Dismiss message">×</button></div>}

      {bookingFlight && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingFlight(null); }}>
        <form className="booking-modal" onSubmit={submitBooking}>
          <button type="button" className="modal-close" onClick={() => setBookingFlight(null)} aria-label="Close booking">×</button>
          <span className="section-kicker">FLIGHT {bookingFlight.flightNumber}</span>
          <h2>Reserve your seat</h2>
          <p>{locationName(bookingFlight, 'departureAirport')} <span>→</span> {locationName(bookingFlight, 'arrivalAirport')}</p>
          <label>Passengers <input type="number" min="1" max={bookingFlight.totalSeats} value={seats} onChange={(event) => setSeats(event.target.value)} required /></label>
          {!token && <p className="modal-hint">Sign in first to complete your booking.</p>}
          <button className="submit-button" disabled={busy || !token}>{busy ? 'Booking…' : `Continue · $${(Number(bookingFlight.price) * Number(seats || 0)).toLocaleString()}`} <span aria-hidden="true">↗</span></button>
        </form>
      </div>}
    </main>
  );
}

export default App;