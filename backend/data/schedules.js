const schedules = [
  {
    title: 'Indore → Morena Express',
    subtitle: 'Via Dewas, Bhopal, Gwalior',
    type: 'AC Sleeper',
    duration: '10h 30m',
    distance: '540 km',
    stops: [
      { city: 'Indore', time: '08:00 PM' },
      { city: 'Bhopal', time: '11:00 PM' },
      { city: 'Gwalior', time: '04:00 AM' },
      { city: 'Morena', time: '06:30 AM' }
    ]
  },
  {
    title: 'Morena → Indore Express',
    subtitle: 'Via Gwalior, Bhopal, Dewas',
    type: 'AC Sleeper',
    duration: '10h 30m',
    distance: '540 km',
    stops: [
      { city: 'Morena', time: '07:00 PM' },
      { city: 'Gwalior', time: '08:30 PM' },
      { city: 'Bhopal', time: '01:00 AM' },
      { city: 'Indore', time: '05:30 AM' }
    ]
  },
  {
    title: 'Indore ↔ Gwalior Daily',
    subtitle: 'Via Bhopal',
    type: 'AC Seater',
    duration: '8h 00m',
    distance: '500 km',
    stops: [
      { city: 'Indore', time: '09:00 PM' },
      { city: 'Bhopal', time: '11:30 PM' },
      { city: 'Gwalior', time: '05:00 AM' }
    ]
  }
];

module.exports = schedules;
