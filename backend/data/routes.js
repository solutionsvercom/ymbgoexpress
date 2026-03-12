const routes = [
  { id: 1, from: 'Indore', to: 'Morena', duration: '10h 30m', price: 799, totalSeats: 32, type: 'AC Sleeper', distance: '480 km', departure: '08:00 PM', arrival: '06:30 AM', stops: [{ city: 'Indore', time: '08:00 PM' }, { city: 'Dewas', time: '08:45 PM' }, { city: 'Bhopal', time: '11:00 PM' }, { city: 'Gwalior', time: '04:00 AM' }, { city: 'Morena', time: '06:30 AM' }] },
  { id: 2, from: 'Morena', to: 'Indore', duration: '10h 30m', price: 799, totalSeats: 32, type: 'AC Sleeper', distance: '480 km', departure: '07:00 PM', arrival: '05:30 AM', stops: [{ city: 'Morena', time: '07:00 PM' }, { city: 'Gwalior', time: '08:30 PM' }, { city: 'Bhopal', time: '01:00 AM' }, { city: 'Dewas', time: '04:30 AM' }, { city: 'Indore', time: '05:30 AM' }] },
  { id: 3, from: 'Indore', to: 'Gwalior', duration: '8h 00m', price: 649, totalSeats: 40, type: 'AC Seater', distance: '370 km', departure: '09:00 PM', arrival: '05:00 AM', stops: [{ city: 'Indore', time: '09:00 PM' }, { city: 'Bhopal', time: '11:30 PM' }, { city: 'Gwalior', time: '05:00 AM' }] },
  { id: 4, from: 'Gwalior', to: 'Indore', duration: '8h 00m', price: 649, totalSeats: 40, type: 'AC Seater', distance: '370 km', departure: '08:00 PM', arrival: '04:00 AM', stops: [{ city: 'Gwalior', time: '08:00 PM' }, { city: 'Bhopal', time: '01:30 AM' }, { city: 'Indore', time: '04:00 AM' }] },
  { id: 5, from: 'Bhopal', to: 'Morena', duration: '6h 30m', price: 549, totalSeats: 32, type: 'AC Sleeper', distance: '290 km', departure: '10:00 PM', arrival: '04:30 AM', stops: [{ city: 'Bhopal', time: '10:00 PM' }, { city: 'Gwalior', time: '02:30 AM' }, { city: 'Morena', time: '04:30 AM' }] },
  { id: 6, from: 'Indore', to: 'Bhopal', duration: '3h 30m', price: 349, totalSeats: 40, type: 'AC Seater', distance: '195 km', departure: '06:00 AM', arrival: '09:30 AM', stops: [{ city: 'Indore', time: '06:00 AM' }, { city: 'Dewas', time: '06:45 AM' }, { city: 'Bhopal', time: '09:30 AM' }] }
];

module.exports = routes;
