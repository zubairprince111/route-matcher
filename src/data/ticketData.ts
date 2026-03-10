export interface City {
  name: string;
  lat: number;
  lng: number;
}

export interface TicketListing {
  id: string;
  origin: string;
  destination: string;
  vehicleType: "Bus" | "Launch" | "Air";
  price: number;
  description: string;
  phone: string;
  postedAt: string;
}

export interface Route {
  origin: City;
  destination: City;
  tickets: TicketListing[];
}

export const cities: Record<string, City> = {
  Dhaka: { name: "Dhaka", lat: 23.8103, lng: 90.4125 },
  Chittagong: { name: "Chittagong", lat: 22.3569, lng: 91.7832 },
  Sylhet: { name: "Sylhet", lat: 24.8949, lng: 91.8687 },
  Rajshahi: { name: "Rajshahi", lat: 24.3745, lng: 88.6042 },
  Khulna: { name: "Khulna", lat: 22.8456, lng: 89.5403 },
  Barishal: { name: "Barishal", lat: 22.701, lng: 90.3535 },
  Rangpur: { name: "Rangpur", lat: 25.7439, lng: 89.2752 },
  Comilla: { name: "Comilla", lat: 23.4607, lng: 91.1809 },
  "Cox's Bazar": { name: "Cox's Bazar", lat: 21.4272, lng: 92.0058 },
};

export const mockTickets: TicketListing[] = [
  { id: "1", origin: "Dhaka", destination: "Chittagong", vehicleType: "Bus", price: 1200, description: "Greenline AC bus, Dec 25 night coach. Window seat.", phone: "+8801712345678", postedAt: "2 hours ago" },
  { id: "2", origin: "Dhaka", destination: "Chittagong", vehicleType: "Bus", price: 1100, description: "Shohagh Paribahan, Dec 25 morning. 2 seats available.", phone: "+8801898765432", postedAt: "5 hours ago" },
  { id: "3", origin: "Dhaka", destination: "Chittagong", vehicleType: "Air", price: 4500, description: "Biman Bangladesh, Dec 24. Economy class ticket.", phone: "+8801555123456", postedAt: "1 hour ago" },
  { id: "4", origin: "Dhaka", destination: "Sylhet", vehicleType: "Bus", price: 900, description: "Hanif Enterprise, Dec 26 afternoon. AC bus.", phone: "+8801611222333", postedAt: "30 min ago" },
  { id: "5", origin: "Dhaka", destination: "Sylhet", vehicleType: "Bus", price: 850, description: "Ena Transport, Dec 25 evening departure.", phone: "+8801777888999", postedAt: "3 hours ago" },
  { id: "6", origin: "Dhaka", destination: "Rajshahi", vehicleType: "Bus", price: 750, description: "BRTC AC bus, Dec 24 morning. Reserved seat.", phone: "+8801999111222", postedAt: "4 hours ago" },
  { id: "7", origin: "Dhaka", destination: "Khulna", vehicleType: "Launch", price: 600, description: "MV Sundarban launch, Dec 25 night. Cabin class.", phone: "+8801444555666", postedAt: "6 hours ago" },
  { id: "8", origin: "Dhaka", destination: "Barishal", vehicleType: "Launch", price: 500, description: "Greenline waterway, Dec 24. Deck cabin.", phone: "+8801333444555", postedAt: "1 hour ago" },
  { id: "9", origin: "Dhaka", destination: "Rangpur", vehicleType: "Bus", price: 800, description: "Agomoni Express, Dec 26 night coach.", phone: "+8801222333444", postedAt: "2 hours ago" },
  { id: "10", origin: "Chittagong", destination: "Cox's Bazar", vehicleType: "Bus", price: 450, description: "S.Alam transport, Dec 25 morning.", phone: "+8801666777888", postedAt: "45 min ago" },
  { id: "11", origin: "Dhaka", destination: "Cox's Bazar", vehicleType: "Air", price: 5200, description: "US-Bangla Airlines, Dec 24 afternoon.", phone: "+8801888999000", postedAt: "20 min ago" },
  { id: "12", origin: "Dhaka", destination: "Comilla", vehicleType: "Bus", price: 350, description: "Asia Line, Dec 25 morning. Non-AC.", phone: "+8801123456789", postedAt: "8 hours ago" },
];

export function getRoutes(): Route[] {
  const routeMap = new Map<string, Route>();

  mockTickets.forEach((ticket) => {
    const key = `${ticket.origin}-${ticket.destination}`;
    if (!routeMap.has(key)) {
      routeMap.set(key, {
        origin: cities[ticket.origin],
        destination: cities[ticket.destination],
        tickets: [],
      });
    }
    routeMap.get(key)!.tickets.push(ticket);
  });

  return Array.from(routeMap.values());
}
