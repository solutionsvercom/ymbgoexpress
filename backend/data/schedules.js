const schedules = [
  { id: 1, title: 'Indore → Morena Express', subtitle: 'Via Dewas, Bhopal, Gwalior', type: 'AC Sleeper', duration: '10h 30m', distance: '480 km', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], stops: [{ city: 'Indore', time: '08:00 PM' }, { city: 'Dewas', time: '08:45 PM' }, { city: 'Bhopal', time: '11:00 PM' }, { city: 'Gwalior', time: '04:00 AM' }, { city: 'Morena', time: '06:30 AM' }] },
  { id: 2, title: 'Morena → Indore Express', subtitle: 'Via Gwalior, Bhopal, Dewas', type: 'AC Sleeper', duration: '10h 30m', distance: '480 km', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], stops: [{ city: 'Morena', time: '07:00 PM' }, { city: 'Gwalior', time: '08:30 PM' }, { city: 'Bhopal', time: '01:00 AM' }, { city: 'Dewas', time: '04:30 AM' }, { city: 'Indore', time: '05:30 AM' }] },
  { id: 3, title: 'Indore ↔ Gwalior Daily', subtitle: 'Via Bhopal', type: 'AC Seater', duration: '8h 00m', distance: '370 km', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], stops: [{ city: 'Indore', time: '09:00 PM' }, { city: 'Bhopal', time: '11:30 PM' }, { city: 'Gwalior', time: '05:00 AM' }] }
];

module.exports = schedules;
