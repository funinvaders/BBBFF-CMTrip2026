
import { AppState } from './types';

export const STORAGE_KEY = 'MUJI_TRIP_CNX_2026';

export const INITIAL_DATA: AppState = {
  flights: [
    {
      id: 'f1',
      type: 'Outbound',
      code: 'UO736',
      airline: 'HK Express',
      date: '2026-03-31',
      departureTime: '07:45',
      arrivalTime: '09:45',
      from: 'HKG',
      to: 'CNX'
    },
    {
      id: 'f2',
      type: 'Return',
      code: 'UO737',
      airline: 'HK Express',
      date: '2026-04-05',
      departureTime: '19:25',
      arrivalTime: '23:20',
      from: 'CNX',
      to: 'HKG'
    }
  ],
  accommodations: [
    {
      id: 'h1',
      name: 'The Inside House',
      address: '56 Samlarn Rd, Phra Sing, Chiang Mai 50200, Thailand',
      checkIn: '2026-03-31',
      checkOut: '2026-04-05',
      link: 'https://www.theinsidehouse.com/'
    }
  ],
  itinerary: [
    {
      id: 'd1',
      dayNumber: 1,
      date: '2026-03-31',
      items: [
        {
          id: 'i1',
          time: '11:00',
          title: 'Check-in The Inside House',
          description: 'Early check-in if available, drop bags and explore Old City.',
          location: 'The Inside House',
          isImportant: true
        },
        {
          id: 'i2',
          time: '13:00',
          title: 'Lunch at Khao Soi Mae Sai',
          description: 'Famous Northern Thai curry noodles.',
          location: 'Khao Soi Mae Sai',
          mapUrl: 'https://maps.google.com/?q=Khao+Soi+Mae+Sai+Chiang+Mai'
        }
      ]
    },
    {
      id: 'd2',
      dayNumber: 2,
      date: '2026-04-01',
      items: [
        {
          id: 'i3',
          time: '09:00',
          title: 'Doi Suthep Temple',
          description: 'Morning visit to the mountain temple for the views.',
          location: 'Wat Phra That Doi Suthep',
          isImportant: true,
          mapUrl: 'https://maps.google.com/?q=Wat+Phra+That+Doi+Suthep'
        }
      ]
    }
  ],
  guides: [
    {
      id: 'g1',
      title: 'Old City Temple Walk',
      content: 'The heart of Chiang Mai is the walled Old City. Highlights include Wat Phra Singh and Wat Chedi Luang. Remember to dress respectfully with shoulders and knees covered.',
      imageUrl: 'https://images.unsplash.com/photo-1542362567-b0337728f2f8?auto=format&fit=crop&q=80&w=800',
      category: 'Temple',
      tags: ['Culture', 'Temples'],
      coordinates: { lat: 18.7885, lng: 98.9853 }
    }
  ],
  expenses: [],
  checklist: [
    { id: 'c1', text: 'Passport', completed: true, category: 'Essentials' },
    { id: 'c2', text: 'Thai Baht (Cash)', completed: false, category: 'Money' },
    { id: 'c3', text: 'Mosquito Repellent', completed: false, category: 'Health' },
    { id: 'c4', text: 'Universal Adapter', completed: true, category: 'Tech' }
  ],
  memos: [
    { id: 'm1', content: 'Book cooking class: https://www.thaicookeryschool.com', timestamp: Date.now() }
  ],
  settings: {
    fxRates: { 'THB': 0.23 }, // 1 THB ≈ 0.23 HKD
    mainCurrency: 'THB'
  }
};
