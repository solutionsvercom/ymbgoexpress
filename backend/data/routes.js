const routes = [
  {
    from: 'Indore', to: 'Morena', duration: '10h 30m', price: 999, seats: 12,
    type: 'AC Sleeper', distance: '540 km', departure: '07:00 PM', arrival: '07:30 AM',
    image: '/images/indore-morena.png',
    stops: [
      { city: 'Krishna travels in front of paani ki tanki teen imli', time: '07:00 PM' },
      { city: 'Yash travels panwan puri paani ki tanki ke samne', time: '07:10 PM' },
      { city: 'Kanadiya bypass bridge ending', time: '07:30 PM' },
      { city: 'Start square', time: '07:50 PM' },
      { city: 'Best price', time: '08:10 PM' },
      { city: 'Mangaliya toll', time: '08:20 PM' }
    ],
    dp: [{ city: 'By Pass', time: '07:45 AM' }]
  },
  {
    from: 'Morena', to: 'Indore', duration: '10h 30m', price: 999, seats: 8,
    type: 'AC Sleeper', distance: '540 km', departure: '09:40 PM', arrival: '09:15 AM',
    image: '/images/morena-indore.jpeg',
    stops: [{ city: 'Purana rajput dhaba ke samne morena', time: '09:05 PM' }],
    dp: [
      { city: 'Mangaliya toll', time: '09:15 AM' },
      { city: 'Best price', time: '09:25 AM' },
      { city: 'Star square', time: '09:35 AM' },
      { city: 'Kanadiya bypass bridge ending', time: '09:45 AM' },
      { city: 'Teen Imli', time: '09:55 AM' }
    ]
  },
  {
    from: 'Indore', to: 'Gwalior', duration: '9h 00m', price: 899, seats: 15,
    type: 'AC Seater', distance: '500 km', departure: '07:00 PM', arrival: '06:30 AM',
    image: '/images/indore-gwalior.png',
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
  },
  {
    from: 'Indore', to: 'Shivpuri', duration: '7h 00m', price: 799, seats: 5,
    type: 'AC Sleeper', distance: '390 km', departure: '07:00 PM', arrival: '04:30 AM',
    image: '/images/bhind-indore.jpeg',
    stops: [
      { city: 'Star Square', time: '07:50 PM' },
      { city: 'Best Price', time: '08:10 PM' },
      { city: 'Mangaliya toll', time: '08:20 PM' }
    ],
    dp: [
      { city: 'Opp medicl collage', time: '04:10 AM' },
      { city: 'Ghoda chouraha,shivpuri', time: '04:10 AM' }
    ]
  },
  {
    from: 'Indore', to: 'Agra', duration: '11h 00m', price: 1099, seats: 18,
    type: 'AC Seater', distance: '690 km', departure: '07:00 PM', arrival: '09:15 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Joon holidays(ymb go express)paani ki tanki ke samne teen imli', time: '07:00 PM' },
      { city: 'Yash travels panwan puri paani ki tanki ke samne', time: '07:10 PM' },
      { city: 'Kanadiya bypass bridge ending', time: '07:30 PM' },
      { city: 'Start square', time: '07:50 PM' },
      { city: 'Best price', time: '08:10 PM' },
      { city: 'Mangaliya toll', time: '08:20 PM' }
    ],
    dp: [
      { city: 'Rohta bypass near new prince dhaba', time: '09:45 AM' },
      { city: 'Eidhgah bus stand', time: '09:55 AM' },
      { city: 'Pratap pura chouraha mg road', time: '10:05 AM' }
    ]
  },
  {
    from: 'Agra', to: 'Indore', duration: '11h 00m', price: 1099, seats: 18,
    type: 'AC Sleeper', distance: '690 km', departure: '07:00 PM', arrival: '09:15 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Sameertravels idgah in front of nepali market agra', time: '06:30 PM' },
      { city: 'Sameer travels pratapura ( opposite kirandeep hotel)', time: '07:15 PM' }
    ],
    dp: [
      { city: 'Mangaliya toll', time: '09:15 AM' },
      { city: 'Best Price', time: '09:25 AM' },
      { city: 'Star Square', time: '09:35 AM' },
      { city: 'Kanadiya bypass bridge ending', time: '09:45 AM' },
      { city: 'Teen Imli', time: '09:55 AM' }
    ]
  },
  {
    from: 'Agra', to: 'Ujjain', duration: '12h 00m', price: 999, seats: 18,
    type: 'AC Sleeper', distance: '640 km', departure: '07:00 PM', arrival: '07:00 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Sameertravels idgah in front of nepali market agra', time: '06:30 PM' },
      { city: 'Sameer travels pratapura ( opposite kirandeep hotel)', time: '07:15 PM' }
    ],
    dp: [{ city: 'Citylink travels dewas gate bus stand shop no. 18 in front of police station', time: '06:30 AM' }]
  },
  {
    from: 'Morena', to: 'Ujjain', duration: '09h 20m', price: 899, seats: 18,
    type: 'AC Sleeper', distance: '500 km', departure: '09:40 PM', arrival: '07:00 AM',
    image: '/images/indore-bhind.png',
    stops: [{ city: 'Purana rajput dhaba ke samne morena', time: '09:40 PM' }],
    dp: [{ city: 'Citylink travels dewas gate bus stand shop no. 18 in front of police station', time: '07:00 AM' }]
  },
  {
    from: 'Gwalior', to: 'Ujjain', duration: '08h 00m', price: 899, seats: 18,
    type: 'AC Sleeper', distance: '460 km', departure: '10:30 PM', arrival: '07:00 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Purani chawanii', time: '10:10 PM' },
      { city: 'Gole Ka Mandir', time: '10:30 PM' },
      { city: 'Bus Stand DB Mall', time: '10:35 PM' },
      { city: 'Chetak Puri', time: '10:50 PM' },
      { city: 'Chandra Badni Naka', time: '10:55 PM' }
    ],
    dp: [{ city: 'Citylink travels dewas gate bus stand shop no. 18 in front of police station', time: '07:00 AM' }]
  },
  {
    from: 'Bhopal', to: 'Gwalior', duration: '08h 00m', price: 999, seats: 18,
    type: 'AC Sleeper', distance: '460 km', departure: '10:30 PM', arrival: '07:00 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Purani chawanii', time: '10:10 PM' },
      { city: 'Gole Ka Mandir', time: '10:30 PM' },
      { city: 'Bus Stand DB Mall', time: '10:35 PM' },
      { city: 'Chetak Puri', time: '10:50 PM' },
      { city: 'Chandra Badni Naka', time: '10:55 PM' }
    ],
    dp: [{ city: 'Citylink travels dewas gate bus stand shop no. 18 in front of police station', time: '07:00 AM' }]
  },
  {
    from: 'Gwalior', to: 'Bhopal', duration: '08h 00m', price: 999, seats: 18,
    type: 'AC Sleeper', distance: '460 km', departure: '10:30 PM', arrival: '07:00 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Purani chawanii', time: '10:10 PM' },
      { city: 'Gole Ka Mandir', time: '10:30 PM' },
      { city: 'Bus Stand DB Mall', time: '10:35 PM' },
      { city: 'Chetak Puri', time: '10:50 PM' },
      { city: 'Chandra Badni Naka', time: '10:55 PM' }
    ],
    dp: [{ city: 'Citylink travels dewas gate bus stand shop no. 18 in front of police station', time: '07:00 AM' }]
  }
];

module.exports = routes;
