const schedules = [
  {
    title: 'Indore → Gwalior Daily',
    subtitle: 'Overnight AC service',
    type: 'AC Seater',
    duration: '9h 00m',
    distance: '500 km',
    active: true,
    stops: [
      { city: 'Indore', time: '07:00 PM' },
      { city: 'Bhopal', time: '11:30 PM' },
      { city: 'Gwalior', time: '06:30 AM' }
    ]
  },
  {
    title: 'Gwalior → Indore Daily',
    subtitle: 'Overnight AC service',
    type: 'AC Seater',
    duration: '9h 00m',
    distance: '500 km',
    active: true,
    stops: [
      { city: 'Gwalior', time: '10:30 PM' },
      { city: 'Bhopal', time: '04:00 AM' },
      { city: 'Indore', time: '09:15 AM' }
    ]
  }
];

module.exports = schedules;
