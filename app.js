// app.js - frontend logic (plain JS)
(function(){
  // references
  const moviesContainer = document.getElementById('movies');
  const slotsContainer = document.getElementById('slots');
  const seatsContainer = document.getElementById('seats');
  const lastBookingContainer = document.getElementById('lastBooking');
  const statusEl = document.getElementById('status');
  const bookBtn = document.getElementById('bookBtn');

  // selection state (persist in localStorage)
  let selectedMovie = localStorage.getItem('movie') || '';
  let selectedSlot = localStorage.getItem('slot') || '';
  let seats = JSON.parse(localStorage.getItem('seats') || '{}');
  if (!seats || Object.keys(seats).length === 0) {
    seats = {};
    seatTypes.forEach(s => seats[s] = 0);
  }

  function saveLocal() {
    localStorage.setItem('movie', selectedMovie);
    localStorage.setItem('slot', selectedSlot);
    localStorage.setItem('seats', JSON.stringify(seats));
  }

  function renderMovies() {
    moviesContainer.innerHTML = '';
    movies.forEach(m => {
      const div = document.createElement('div');
      div.className = 'movie-column' + (selectedMovie === m ? ' movie-column-selected' : '');
      div.textContent = m;
      div.onclick = () => { selectedMovie = m; saveLocal(); renderAll(); };
      moviesContainer.appendChild(div);
    });
  }

  function renderSlots() {
    slotsContainer.innerHTML = '';
    slots.forEach(s => {
      const div = document.createElement('div');
      div.className = 'slot-column' + (selectedSlot === s ? ' slot-column-selected' : '');
      div.textContent = s;
      div.onclick = () => { selectedSlot = s; saveLocal(); renderAll(); };
      slotsContainer.appendChild(div);
    });
  }

  function renderSeats() {
    seatsContainer.innerHTML = '';
    seatTypes.forEach(type => {
      const wrapper = document.createElement('div');
      wrapper.className = 'seat-column' + (seats[type] > 0 ? ' seat-column-selected' : '');
      const title = document.createElement('div');
      title.innerHTML = '<b>Type ' + type + '</b>';
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.value = seats[type];
      input.id = 'seat-' + type;
      input.oninput = (e) => {
        const v = parseInt(e.target.value || 0, 10);
        seats[type] = isNaN(v) ? 0 : Math.max(0, v);
        saveLocal();
        renderSeats();
      };
      wrapper.appendChild(title);
      wrapper.appendChild(input);
      seatsContainer.appendChild(wrapper);
    });
  }

  function fetchLastBooking() {
    lastBookingContainer.innerHTML = 'Loading...';
    fetch('/api/booking')
      .then(r => r.json())
      .then(data => {
        if (data.message) {
          lastBookingContainer.textContent = data.message;
        } else {
          // display structured details
          const html = [];
          html.push('<div><strong>movie:</strong> ' + data.movie + '</div>');
          html.push('<div><strong>slot:</strong> ' + data.slot + '</div>');
          html.push('<div style="margin-top:8px"><strong>seats:</strong></div>');
          html.push('<div style="font-family:monospace">');
          seatTypes.forEach(t => {
            html.push('<div>' + t + ': ' + (data.seats[t] || 0) + '</div>');
          });
          html.push('</div>');
          lastBookingContainer.innerHTML = html.join('\n');
        }
      })
      .catch(err => {
        lastBookingContainer.textContent = 'no previous booking found';
        console.error(err);
      });
  }

  function totalTickets() {
    return Object.values(seats).reduce((a,b) => a + Number(b || 0), 0);
  }

  bookBtn.onclick = async function() {
    statusEl.textContent = '';
    if (!selectedMovie || !selectedSlot) {
      statusEl.textContent = 'Please select a movie and a slot.';
      return;
    }
    if (totalTickets() <= 0) {
      statusEl.textContent = 'Please select at least one ticket.';
      return;
    }

    const body = { movie: selectedMovie, seats, slot: selectedSlot };
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.status === 200) {
        statusEl.textContent = 'Booking successful!';
        // update last booking from our payload (do not re-fetch)
        const html = [];
        html.push('<div><strong>movie:</strong> ' + body.movie + '</div>');
        html.push('<div><strong>slot:</strong> ' + body.slot + '</div>');
        html.push('<div style="margin-top:8px"><strong>seats:</strong></div>');
        html.push('<div style="font-family:monospace">');
        seatTypes.forEach(t => html.push('<div>' + t + ': ' + (body.seats[t] || 0) + '</div>'));
        html.push('</div>');
        lastBookingContainer.innerHTML = html.join('\n');

        // clear selection
        selectedMovie = '';
        selectedSlot = '';
        seatTypes.forEach(s => seats[s] = 0);
        localStorage.removeItem('movie');
        localStorage.removeItem('slot');
        localStorage.removeItem('seats');
        renderAll();
      } else {
        const data = await res.json();
        statusEl.textContent = data.message || 'Booking failed';
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Booking failed (network error)';
    }
  };

  function renderAll() {
    renderMovies();
    renderSlots();
    renderSeats();
  }

  renderAll();
  fetchLastBooking();
})();
