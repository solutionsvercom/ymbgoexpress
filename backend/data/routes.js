const routes = [
  {
    from: 'Indore', to: 'Gwalior', duration: '9h 00m', price: 899, seats: 15,
    type: 'AC Seater', distance: '500 km', departure: '07:00 PM', arrival: '06:30 AM',
    image: '/images/indore-gwalior.png',
    active: true,
    stops: [
      { city: 'Kanadiya bypass bridge ending', time: '07:30 PM' },
      { city: 'Star Square', time: '07:50 PM' },
      { city: 'Best Price', time: '08:10 AM' },
      { city: 'Mangaliya toll', time: '08:20 PM' }
    ],
    dp: [
      { city: 'chandra badni naka', time: '06:30 AM' },
      { city: 'Chetakpuri bus stand', time: '06:40 AM' },
      { city: 'Aakashvani shubasmall gwalior', time: '06:50 AM' },
      { city: 'Db mall opposite railway station', time: '07:00 AM' },
      { city: 'Gole Ka Mandir', time: '07:10 AM' }
    ]
  },
  {
    from: 'Gwalior', to: 'Indore', duration: '9h 00m', price: 899, seats: 20,
    type: 'AC Seater', distance: '500 km', departure: '10:30 PM', arrival: '09:15 AM',
    image: '/images/gwalior-indore.jpeg',
    active: true,
    stops: [
      { city: 'Purani chawani', time: '10:10 PM' },
      { city: 'Gole Ka Mandir', time: '10:30 PM' },
      { city: 'Bus Stand DB Mall', time: '10:35 PM' },
      { city: 'Chetak Puri', time: '10:50 PM' },
      { city: 'Chandra Badni Naka', time: '10:55 PM' }
    ],
    dp: [
      { city: 'Mangaliya toll', time: '09:15 AM' },
      { city: 'Best Price', time: '09:25 AM' },
      { city: 'Star Square', time: '09:35 AM' },
      { city: 'Kanadiya bypass bridge ending', time: '09:45 AM' },
      { city: 'Teen Imli', time: '09:55 AM' }
    ]
  }
];

module.exports = routes;
