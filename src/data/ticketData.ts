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
  "ঢাকা": { name: "ঢাকা", lat: 23.8103, lng: 90.4125 },
  "চট্টগ্রাম": { name: "চট্টগ্রাম", lat: 22.3569, lng: 91.7832 },
  "সিলেট": { name: "সিলেট", lat: 24.8949, lng: 91.8687 },
  "রাজশাহী": { name: "রাজশাহী", lat: 24.3745, lng: 88.6042 },
  "খুলনা": { name: "খুলনা", lat: 22.8456, lng: 89.5403 },
  "বরিশাল": { name: "বরিশাল", lat: 22.701, lng: 90.3535 },
  "রংপুর": { name: "রংপুর", lat: 25.7439, lng: 89.2752 },
  "কুমিল্লা": { name: "কুমিল্লা", lat: 23.4607, lng: 91.1809 },
  "কক্সবাজার": { name: "কক্সবাজার", lat: 21.4272, lng: 92.0058 },
  "ময়মনসিংহ": { name: "ময়মনসিংহ", lat: 24.7471, lng: 90.4203 },
  "গাজীপুর": { name: "গাজীপুর", lat: 24.0023, lng: 90.4264 },
  "নারায়ণগঞ্জ": { name: "নারায়ণগঞ্জ", lat: 23.6238, lng: 90.5 },
  "টাঙ্গাইল": { name: "টাঙ্গাইল", lat: 24.2513, lng: 89.9164 },
  "কিশোরগঞ্জ": { name: "কিশোরগঞ্জ", lat: 24.444, lng: 90.7766 },
  "মানিকগঞ্জ": { name: "মানিকগঞ্জ", lat: 23.8617, lng: 90.0003 },
  "মুন্সিগঞ্জ": { name: "মুন্সিগঞ্জ", lat: 23.5422, lng: 90.5305 },
  "নরসিংদী": { name: "নরসিংদী", lat: 23.9322, lng: 90.7151 },
  "ফরিদপুর": { name: "ফরিদপুর", lat: 23.6074, lng: 89.8429 },
  "গোপালগঞ্জ": { name: "গোপালগঞ্জ", lat: 23.0488, lng: 89.8266 },
  "মাদারীপুর": { name: "মাদারীপুর", lat: 23.164, lng: 90.1896 },
  "রাজবাড়ী": { name: "রাজবাড়ী", lat: 23.7574, lng: 89.6445 },
  "শরীয়তপুর": { name: "শরীয়তপুর", lat: 23.2423, lng: 90.4348 },
  "ব্রাহ্মণবাড়িয়া": { name: "ব্রাহ্মণবাড়িয়া", lat: 23.9608, lng: 91.1115 },
  "চাঁদপুর": { name: "চাঁদপুর", lat: 23.2333, lng: 90.6712 },
  "ফেনী": { name: "ফেনী", lat: 23.0159, lng: 91.3976 },
  "হবিগঞ্জ": { name: "হবিগঞ্জ", lat: 24.374, lng: 91.4166 },
  "লক্ষ্মীপুর": { name: "লক্ষ্মীপুর", lat: 22.9425, lng: 90.841 },
  "মৌলভীবাজার": { name: "মৌলভীবাজার", lat: 24.482, lng: 91.7774 },
  "নোয়াখালী": { name: "নোয়াখালী", lat: 22.8696, lng: 91.0995 },
  "সুনামগঞ্জ": { name: "সুনামগঞ্জ", lat: 25.0658, lng: 91.3995 },
  "বগুড়া": { name: "বগুড়া", lat: 24.8465, lng: 89.3773 },
  "চাঁপাইনবাবগঞ্জ": { name: "চাঁপাইনবাবগঞ্জ", lat: 24.5965, lng: 88.2776 },
  "জয়পুরহাট": { name: "জয়পুরহাট", lat: 25.0968, lng: 89.0228 },
  "নওগাঁ": { name: "নওগাঁ", lat: 24.7936, lng: 88.9318 },
  "নাটোর": { name: "নাটোর", lat: 24.4206, lng: 89.0007 },
  "নবাবগঞ্জ": { name: "নবাবগঞ্জ", lat: 24.5941, lng: 88.2772 },
  "পাবনা": { name: "পাবনা", lat: 24.0064, lng: 89.2372 },
  "সিরাজগঞ্জ": { name: "সিরাজগঞ্জ", lat: 24.4534, lng: 89.7007 },
  "বাগেরহাট": { name: "বাগেরহাট", lat: 22.6512, lng: 89.7851 },
  "চুয়াডাঙ্গা": { name: "চুয়াডাঙ্গা", lat: 23.6402, lng: 88.842 },
  "যশোর": { name: "যশোর", lat: 23.1665, lng: 89.2135 },
  "ঝিনাইদহ": { name: "ঝিনাইদহ", lat: 23.5448, lng: 89.1726 },
  "কুষ্টিয়া": { name: "কুষ্টিয়া", lat: 23.9013, lng: 89.1201 },
  "মাগুরা": { name: "মাগুরা", lat: 23.4873, lng: 89.419 },
  "মেহেরপুর": { name: "মেহেরপুর", lat: 23.7627, lng: 88.6318 },
  "নড়াইল": { name: "নড়াইল", lat: 23.1725, lng: 89.5126 },
  "সাতক্ষীরা": { name: "সাতক্ষীরা", lat: 22.7185, lng: 89.0705 },
  "বরগুনা": { name: "বরগুনা", lat: 22.1503, lng: 90.1266 },
  "ভোলা": { name: "ভোলা", lat: 22.6859, lng: 90.6482 },
  "ঝালকাঠি": { name: "ঝালকাঠি", lat: 22.6406, lng: 90.1987 },
  "পটুয়াখালী": { name: "পটুয়াখালী", lat: 22.3596, lng: 90.3293 },
  "পিরোজপুর": { name: "পিরোজপুর", lat: 22.5791, lng: 89.9759 },
  "দিনাজপুর": { name: "দিনাজপুর", lat: 25.6279, lng: 88.6332 },
  "গাইবান্ধা": { name: "গাইবান্ধা", lat: 25.3288, lng: 89.5286 },
  "কুড়িগ্রাম": { name: "কুড়িগ্রাম", lat: 25.8054, lng: 89.6362 },
  "লালমনিরহাট": { name: "লালমনিরহাট", lat: 25.9165, lng: 89.4445 },
  "নীলফামারী": { name: "নীলফামারী", lat: 25.9316, lng: 88.856 },
  "পঞ্চগড়": { name: "পঞ্চগড়", lat: 26.3411, lng: 88.5542 },
  "ঠাকুরগাঁও": { name: "ঠাকুরগাঁও", lat: 26.0336, lng: 88.4616 },
  "বান্দরবান": { name: "বান্দরবান", lat: 22.1953, lng: 92.2184 },
  "খাগড়াছড়ি": { name: "খাগড়াছড়ি", lat: 23.1193, lng: 91.9847 },
  "রাঙ্গামাটি": { name: "রাঙ্গামাটি", lat: 22.6324, lng: 92.1036 },
  "নেত্রকোনা": { name: "নেত্রকোনা", lat: 24.8704, lng: 90.7279 },
  "শেরপুর": { name: "শেরপুর", lat: 25.0204, lng: 90.0153 },
  "জামালপুর": { name: "জামালপুর", lat: 24.919, lng: 89.948 },
};

export const mockTickets: TicketListing[] = [
  { id: "1", origin: "ঢাকা", destination: "চট্টগ্রাম", vehicleType: "Bus", operatorName: "Greenline Paribahan", price: 1200, description: "Greenline AC bus, Dec 25 night coach. Window seat.", phone: "+8801712345678", postedAt: "2 hours ago" },
  { id: "2", origin: "ঢাকা", destination: "চট্টগ্রাম", vehicleType: "Bus", operatorName: "Shohagh Paribahan", price: 1100, description: "Shohagh Paribahan, Dec 25 morning. 2 seats available.", phone: "+8801898765432", postedAt: "5 hours ago" },
  { id: "3", origin: "ঢাকা", destination: "চট্টগ্রাম", vehicleType: "Air", operatorName: "Biman Bangladesh", price: 4500, description: "Biman Bangladesh, Dec 24. Economy class ticket.", phone: "+8801555123456", postedAt: "1 hour ago" },
  { id: "4", origin: "ঢাকা", destination: "সিলেট", vehicleType: "Bus", operatorName: "Hanif Enterprise", price: 900, description: "Hanif Enterprise, Dec 26 afternoon. AC bus.", phone: "+8801611222333", postedAt: "30 min ago" },
  { id: "5", origin: "ঢাকা", destination: "সিলেট", vehicleType: "Bus", operatorName: "Ena Transport", price: 850, description: "Ena Transport, Dec 25 evening departure.", phone: "+8801777888999", postedAt: "3 hours ago" },
  { id: "6", origin: "ঢাকা", destination: "রাজশাহী", vehicleType: "Bus", operatorName: "BRTC", price: 750, description: "BRTC AC bus, Dec 24 morning. Reserved seat.", phone: "+8801999111222", postedAt: "4 hours ago" },
  { id: "7", origin: "ঢাকা", destination: "খুলনা", vehicleType: "Launch", operatorName: "MV Sundarban", price: 600, description: "MV Sundarban launch, Dec 25 night. Cabin class.", phone: "+8801444555666", postedAt: "6 hours ago" },
  { id: "8", origin: "ঢাকা", destination: "বরিশাল", vehicleType: "Launch", operatorName: "Greenline Waterway", price: 500, description: "Greenline waterway, Dec 24. Deck cabin.", phone: "+8801333444555", postedAt: "1 hour ago" },
  { id: "9", origin: "ঢাকা", destination: "রংপুর", vehicleType: "Bus", operatorName: "Agomoni Express", price: 800, description: "Agomoni Express, Dec 26 night coach.", phone: "+8801222333444", postedAt: "2 hours ago" },
  { id: "10", origin: "চট্টগ্রাম", destination: "কক্সবাজার", vehicleType: "Bus", operatorName: "S. Alam Transport", price: 450, description: "S.Alam transport, Dec 25 morning.", phone: "+8801666777888", postedAt: "45 min ago" },
  { id: "11", origin: "ঢাকা", destination: "কক্সবাজার", vehicleType: "Air", operatorName: "US-Bangla Airlines", price: 5200, description: "US-Bangla Airlines, Dec 24 afternoon.", phone: "+8801888999000", postedAt: "20 min ago" },
  { id: "12", origin: "ঢাকা", destination: "কুমিল্লা", vehicleType: "Bus", operatorName: "Asia Line", price: 350, description: "Asia Line, Dec 25 morning. Non-AC.", phone: "+8801123456789", postedAt: "8 hours ago" },
  { id: "13", origin: "ঢাকা", destination: "চট্টগ্রাম", vehicleType: "Train", operatorName: "Sonar Bangla Express", price: 700, description: "Sonar Bangla Express, Dec 25. AC Chair.", phone: "+8801712000111", postedAt: "1 hour ago" },
  { id: "14", origin: "ঢাকা", destination: "সিলেট", vehicleType: "Train", operatorName: "Parabat Express", price: 550, description: "Parabat Express, Dec 26. Snigdha class.", phone: "+8801812000222", postedAt: "3 hours ago" },
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
