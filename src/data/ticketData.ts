export interface City {
  name: string;
  lat: number;
  lng: number;
}

export interface TicketListing {
  id: string;
  origin: string;
  destination: string;
  vehicleType: "Bus" | "Launch" | "Air" | "Train";
  operatorName?: string;
  price: number;
  description: string;
  phone: string;
  postedAt: string;
  reportCount?: number;
  isFraud?: boolean;
}

export interface LocalFareReport {
  id: string;
  fromArea: string;
  toArea: string;
  vehicleType: "Local Bus" | "Rickshaw" | "CNG" | "Shared Auto";
  price: number;
  description?: string;
  phone?: string;
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
  Mymensingh: { name: "Mymensingh", lat: 24.7471, lng: 90.4203 },
  Gazipur: { name: "Gazipur", lat: 24.0023, lng: 90.4264 },
  Narayanganj: { name: "Narayanganj", lat: 23.6238, lng: 90.5 },
  Tangail: { name: "Tangail", lat: 24.2513, lng: 89.9164 },
  Kishoreganj: { name: "Kishoreganj", lat: 24.444, lng: 90.7766 },
  Manikganj: { name: "Manikganj", lat: 23.8617, lng: 90.0003 },
  Munshiganj: { name: "Munshiganj", lat: 23.5422, lng: 90.5305 },
  Narsingdi: { name: "Narsingdi", lat: 23.9322, lng: 90.7151 },
  Faridpur: { name: "Faridpur", lat: 23.6074, lng: 89.8429 },
  Gopalganj: { name: "Gopalganj", lat: 23.0488, lng: 89.8266 },
  Madaripur: { name: "Madaripur", lat: 23.164, lng: 90.1896 },
  Rajbari: { name: "Rajbari", lat: 23.7574, lng: 89.6445 },
  Shariatpur: { name: "Shariatpur", lat: 23.2423, lng: 90.4348 },
  Brahmanbaria: { name: "Brahmanbaria", lat: 23.9608, lng: 91.1115 },
  Chandpur: { name: "Chandpur", lat: 23.2333, lng: 90.6712 },
  Feni: { name: "Feni", lat: 23.0159, lng: 91.3976 },
  Habiganj: { name: "Habiganj", lat: 24.374, lng: 91.4166 },
  Lakshmipur: { name: "Lakshmipur", lat: 22.9425, lng: 90.841 },
  Moulvibazar: { name: "Moulvibazar", lat: 24.482, lng: 91.7774 },
  Noakhali: { name: "Noakhali", lat: 22.8696, lng: 91.0995 },
  Sunamganj: { name: "Sunamganj", lat: 25.0658, lng: 91.3995 },
  Bogra: { name: "Bogra", lat: 24.8465, lng: 89.3773 },
  Chapainawabganj: { name: "Chapainawabganj", lat: 24.5965, lng: 88.2776 },
  Joypurhat: { name: "Joypurhat", lat: 25.0968, lng: 89.0228 },
  Naogaon: { name: "Naogaon", lat: 24.7936, lng: 88.9318 },
  Natore: { name: "Natore", lat: 24.4206, lng: 89.0007 },
  Nawabganj: { name: "Nawabganj", lat: 24.5941, lng: 88.2772 },
  Pabna: { name: "Pabna", lat: 24.0064, lng: 89.2372 },
  Sirajganj: { name: "Sirajganj", lat: 24.4534, lng: 89.7007 },
  Bagerhat: { name: "Bagerhat", lat: 22.6512, lng: 89.7851 },
  Chuadanga: { name: "Chuadanga", lat: 23.6402, lng: 88.842 },
  Jessore: { name: "Jessore", lat: 23.1665, lng: 89.2135 },
  Jhenaidah: { name: "Jhenaidah", lat: 23.5448, lng: 89.1726 },
  Kushtia: { name: "Kushtia", lat: 23.9013, lng: 89.1201 },
  Magura: { name: "Magura", lat: 23.4873, lng: 89.419 },
  Meherpur: { name: "Meherpur", lat: 23.7627, lng: 88.6318 },
  Narail: { name: "Narail", lat: 23.1725, lng: 89.5126 },
  Satkhira: { name: "Satkhira", lat: 22.7185, lng: 89.0705 },
  Barguna: { name: "Barguna", lat: 22.1503, lng: 90.1266 },
  Bhola: { name: "Bhola", lat: 22.6859, lng: 90.6482 },
  Jhalokati: { name: "Jhalokati", lat: 22.6406, lng: 90.1987 },
  Patuakhali: { name: "Patuakhali", lat: 22.3596, lng: 90.3293 },
  Pirojpur: { name: "Pirojpur", lat: 22.5791, lng: 89.9759 },
  Dinajpur: { name: "Dinajpur", lat: 25.6279, lng: 88.6332 },
  Gaibandha: { name: "Gaibandha", lat: 25.3288, lng: 89.5286 },
  Kurigram: { name: "Kurigram", lat: 25.8054, lng: 89.6362 },
  Lalmonirhat: { name: "Lalmonirhat", lat: 25.9165, lng: 89.4445 },
  Nilphamari: { name: "Nilphamari", lat: 25.9316, lng: 88.856 },
  Panchagarh: { name: "Panchagarh", lat: 26.3411, lng: 88.5542 },
  Thakurgaon: { name: "Thakurgaon", lat: 26.0336, lng: 88.4616 },
  Bandarban: { name: "Bandarban", lat: 22.1953, lng: 92.2184 },
  Khagrachhari: { name: "Khagrachhari", lat: 23.1193, lng: 91.9847 },
  Rangamati: { name: "Rangamati", lat: 22.6324, lng: 92.1036 },
  Netrokona: { name: "Netrokona", lat: 24.8704, lng: 90.7279 },
  Sherpur: { name: "Sherpur", lat: 25.0204, lng: 90.0153 },
};

export const mockTickets: TicketListing[] = [
  { id: "1", origin: "Dhaka", destination: "Chittagong", vehicleType: "Bus", operatorName: "Greenline Paribahan", price: 1200, description: "Greenline AC bus, Dec 25 night coach. Window seat.", phone: "+8801712345678", postedAt: "2 hours ago" },
  { id: "2", origin: "Dhaka", destination: "Chittagong", vehicleType: "Bus", operatorName: "Shohagh Paribahan", price: 1100, description: "Shohagh Paribahan, Dec 25 morning. 2 seats available.", phone: "+8801898765432", postedAt: "5 hours ago" },
  { id: "3", origin: "Dhaka", destination: "Chittagong", vehicleType: "Air", operatorName: "Biman Bangladesh", price: 4500, description: "Biman Bangladesh, Dec 24. Economy class ticket.", phone: "+8801555123456", postedAt: "1 hour ago" },
  { id: "4", origin: "Dhaka", destination: "Sylhet", vehicleType: "Bus", operatorName: "Hanif Enterprise", price: 900, description: "Hanif Enterprise, Dec 26 afternoon. AC bus.", phone: "+8801611222333", postedAt: "30 min ago" },
  { id: "5", origin: "Dhaka", destination: "Sylhet", vehicleType: "Bus", operatorName: "Ena Transport", price: 850, description: "Ena Transport, Dec 25 evening departure.", phone: "+8801777888999", postedAt: "3 hours ago" },
  { id: "6", origin: "Dhaka", destination: "Rajshahi", vehicleType: "Bus", operatorName: "BRTC", price: 750, description: "BRTC AC bus, Dec 24 morning. Reserved seat.", phone: "+8801999111222", postedAt: "4 hours ago" },
  { id: "7", origin: "Dhaka", destination: "Khulna", vehicleType: "Launch", operatorName: "MV Sundarban", price: 600, description: "MV Sundarban launch, Dec 25 night. Cabin class.", phone: "+8801444555666", postedAt: "6 hours ago" },
  { id: "8", origin: "Dhaka", destination: "Barishal", vehicleType: "Launch", operatorName: "Greenline Waterway", price: 500, description: "Greenline waterway, Dec 24. Deck cabin.", phone: "+8801333444555", postedAt: "1 hour ago" },
  { id: "9", origin: "Dhaka", destination: "Rangpur", vehicleType: "Bus", operatorName: "Agomoni Express", price: 800, description: "Agomoni Express, Dec 26 night coach.", phone: "+8801222333444", postedAt: "2 hours ago" },
  { id: "10", origin: "Chittagong", destination: "Cox's Bazar", vehicleType: "Bus", operatorName: "S. Alam Transport", price: 450, description: "S.Alam transport, Dec 25 morning.", phone: "+8801666777888", postedAt: "45 min ago" },
  { id: "11", origin: "Dhaka", destination: "Cox's Bazar", vehicleType: "Air", operatorName: "US-Bangla Airlines", price: 5200, description: "US-Bangla Airlines, Dec 24 afternoon.", phone: "+8801888999000", postedAt: "20 min ago" },
  { id: "12", origin: "Dhaka", destination: "Comilla", vehicleType: "Bus", operatorName: "Asia Line", price: 350, description: "Asia Line, Dec 25 morning. Non-AC.", phone: "+8801123456789", postedAt: "8 hours ago" },
  { id: "13", origin: "Dhaka", destination: "Chittagong", vehicleType: "Train", operatorName: "Sonar Bangla Express", price: 700, description: "Sonar Bangla Express, Dec 25. AC Chair.", phone: "+8801712000111", postedAt: "1 hour ago" },
  { id: "14", origin: "Dhaka", destination: "Sylhet", vehicleType: "Train", operatorName: "Parabat Express", price: 550, description: "Parabat Express, Dec 26. Snigdha class.", phone: "+8801812000222", postedAt: "3 hours ago" },
];

export const mockLocalFares: LocalFareReport[] = [
  { id: "l1", fromArea: "Uttara", toArea: "Banani", vehicleType: "Local Bus", price: 30, postedAt: "1 hour ago", description: "Raida Poribahan" },
  { id: "l2", fromArea: "Dhanmondi", toArea: "Farmgate", vehicleType: "Rickshaw", price: 60, postedAt: "30 min ago" },
  { id: "l3", fromArea: "Mohakhali", toArea: "Gulshan 1", vehicleType: "CNG", price: 150, postedAt: "2 hours ago" },
  { id: "l4", fromArea: "Mirpur 10", toArea: "Motijheel", vehicleType: "Shared Auto", price: 40, postedAt: "1 hour ago" },
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
