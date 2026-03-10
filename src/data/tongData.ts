export interface TongLocation {
    id: string;
    name: string;
    lat: number;
    lng: number;
    openTime: string; // 24h format HH:mm
    closeTime: string; // 24h format HH:mm
    description: string;
    rating: number;
    type: "Tong" | "Boutique" | "Hangout";
    address: string;
}

export const mockTongs: TongLocation[] = [
    {
        id: "t1",
        name: "Rabindra Sarobar Tong",
        lat: 23.7485,
        lng: 90.3752,
        openTime: "10:00",
        closeTime: "22:00",
        description: "Iconic tea and snacks spot with a view. Famous for 'Malai Cha'.",
        rating: 4.8,
        type: "Tong",
        address: "Dhanmondi Lake, Dhaka"
    },
    {
        id: "t2",
        name: "TSC Chayer Tong",
        lat: 23.7325,
        lng: 90.3952,
        openTime: "07:00",
        closeTime: "23:59",
        description: "Heart of DU. Perfect for late night adda and student vibes.",
        rating: 4.9,
        type: "Tong",
        address: "TSC, University of Dhaka"
    },
    {
        id: "t3",
        name: "Tripti Boutique Cafe",
        lat: 23.7937,
        lng: 90.4066,
        openTime: "11:00",
        closeTime: "02:00",
        description: "Premium hangout spot with boutique decor and artisanal tea.",
        rating: 4.5,
        type: "Boutique",
        address: "Banani Road 11, Dhaka"
    },
    {
        id: "t4",
        name: "Puran Dhaka Bakarkhani Spot",
        lat: 23.7151,
        lng: 90.3952,
        openTime: "18:00",
        closeTime: "05:00",
        description: "Late night paradise for foodies. Best for night owls.",
        rating: 4.7,
        type: "Hangout",
        address: "Nazira Bazar, Old Dhaka"
    },
    {
        id: "t5",
        name: "Uttara Sector 3 Adda Zone",
        lat: 23.8712,
        lng: 90.3944,
        openTime: "16:00",
        closeTime: "03:00",
        description: "A popular corner for evening gatherings and late night street food.",
        rating: 4.6,
        type: "Hangout",
        address: "Sector 3, Uttara"
    }
];

export function isTongOpen(tong: TongLocation): boolean {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = tong.openTime.split(":").map(Number);
    const [closeH, closeM] = tong.closeTime.split(":").map(Number);

    const openTime = openH * 60 + openM;
    let closeTime = closeH * 60 + closeM;

    if (closeTime < openTime) {
        // Overlap to next day (e.g., 18:00 to 05:00)
        if (currentTime >= openTime || currentTime <= closeTime) return true;
    } else {
        if (currentTime >= openTime && currentTime <= closeTime) return true;
    }

    return false;
}
