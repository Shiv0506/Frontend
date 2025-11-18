import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // For styling (see below)
import { movies, slots, seats } from './data';

function App() {
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedSeats, setSelectedSeats] = useState({});
  const [lastBooking, setLastBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load selections from localStorage on mount
  useEffect(() => {
    const storedMovie = localStorage.getItem('movie');
    const storedSeats = localStorage.getItem('seats');
    const storedSlot = localStorage.getItem('slot');
    if (storedMovie) setSelectedMovie(storedMovie);
    if (storedSeats) setSelectedSeats(JSON.parse(storedSeats));
    if (storedSlot) setSelectedSlot(storedSlot);

    // Fetch last booking on load
    fetchLastBooking();
  }, []);

  // Save to localStorage whenever selections change
  useEffect(() => {
    localStorage.setItem('movie', selectedMovie);
    localStorage.setItem('seats', JSON.stringify(selectedSeats));
    localStorage.setItem('slot', selectedSlot);
  }, [selectedMovie, selectedSeats, selectedSlot]);

  const fetchLastBooking = async () => {
    try {
      const response = await axios.get('/api/booking');
      if (response.data.message) {
        setLastBooking(null);
      } else {
        setLastBooking(response.data);
      }
    } catch (error) {
      console.error('Error fetching last booking:', error);
    }
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSeatChange = (seatType, count) => {
    setSelectedSeats({ ...selectedSeats, [seatType]: parseInt(count) || 0 });
  };

  const handleSubmit = async () => {
    if (!selectedMovie || !selectedSlot || !Object.values(selectedSeats).some(count => count > 0)) {
      alert('Please select a movie, slot, and at least one seat.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('/api/booking', {
        movie: selectedMovie,
        seats: selectedSeats,
        slot: selectedSlot,
      });
      if (response.status === 200) {
        // Update last booking without GET
        setLastBooking({ movie: selectedMovie, seats: selectedSeats, slot: selectedSlot });
        // Clear selections
        setSelectedMovie('');
        setSelectedSlot('');
        setSelectedSeats({});
        localStorage.removeItem('movie');
        localStorage.removeItem('seats');
        localStorage.removeItem('slot');
      }
    } catch (error) {
      alert('Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Book My Show</h1>

      {/* Movies */}
      <div className="section">
        <h2>Select Movie</h2>
        <div className="options">
          {movies.map((movie) => (
            <div
              key={movie}
              className={`option ${selectedMovie === movie ? 'selected' : ''}`}
              onClick={() => handleMovieSelect(movie)}
            >
              {movie}
            </div>
          ))}
        </div>
      </div>

      {/* Slots */}
      <div className="section">
        <h2>Select Slot</h2>
        <div className="options">
          {slots.map((slot) => (
            <div
              key={slot}
              className={`option ${selectedSlot === slot ? 'selected' : ''}`}
              onClick={() => handleSlotSelect(slot)}
            >
              {slot}
            </div>
          ))}
        </div>
      </div>

      {/* Seats */}
      <div className="section">
        <h2>Select Seats</h2>
        <div className="seats">
          {seats.map((seat) => (
            <div key={seat} className="seat-type">
              <h3>Type {seat}</h3>
              <input
                id={`seat-${seat}`}
                type="number"
                min="0"
                value={selectedSeats[seat] || 0}
                onChange={(e) => handleSeatChange(seat, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Booking...' : 'Book Now'}
      </button>

      {/* Last Booking */}
      <div className="last-booking">
        <h2>Last Booking Details</h2>
        {lastBooking ? (
          <div>
            <p><strong>Movie:</strong> {lastBooking.movie}</p>
            <p><strong>Slot:</strong> {lastBooking.slot}</p>
            <p><strong>Seats:</strong></p>
            <ul>
              {Object.entries(lastBooking.seats).map(([type, count]) => (
                count > 0 && <li key={type}>{type}: {count}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>no previous booking found</p>
        )}
      </div>
    </div>
  );
}

export default App;