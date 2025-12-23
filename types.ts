
export interface FlightInfo {
  id: string;
  type: 'Outbound' | 'Return';
  code: string;
  airline: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
}

export interface AccommodationInfo {
  id: string;
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  link?: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  location?: string;
  mapUrl?: string;
  blogUrl?: string;
  isImportant?: boolean;
}

export interface DayPlan {
  id: string;
  dayNumber: number;
  date: string;
  items: ItineraryItem[];
}

export type GuideCategory = 'Food' | 'Relax' | 'Temple' | 'Shopping' | 'Sightseeing' | 'General';

export interface GuideArticle {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: GuideCategory;
  coordinates?: { lat: number; lng: number };
  tags: string[];
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  currency: string;
  hkdAmount: number;
  category: string;
  date: string;
  photo?: string; // Base64 thumbnail
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

export interface MemoEntry {
  id: string;
  content: string;
  timestamp: number;
}

export interface TripSettings {
  fxRates: { [key: string]: number }; // e.g. { "THB": 0.23 }
  mainCurrency: string;
}

export interface AppState {
  flights: FlightInfo[];
  accommodations: AccommodationInfo[];
  itinerary: DayPlan[];
  guides: GuideArticle[];
  expenses: Expense[];
  checklist: ChecklistItem[];
  memos: MemoEntry[];
  settings: TripSettings;
}

export enum Page {
  PLAN = 'plan',
  GUIDE = 'guide',
  WALLET = 'wallet',
  LISTS = 'lists',
  INFO = 'info'
}
