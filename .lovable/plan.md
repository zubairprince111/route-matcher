

## Plan: Add Train vehicle type, operator name field, and all 64 Bangladesh districts

### Changes

**1. `src/data/ticketData.ts`**
- Add `"Train"` to the `vehicleType` union type: `"Bus" | "Launch" | "Air" | "Train"`
- Add `operatorName` optional string field to `TicketListing`
- Expand `cities` record to include all 64 districts of Bangladesh with their lat/lng coordinates (Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, Comilla, Cox's Bazar, Mymensingh, Gazipur, Narayanganj, Tangail, Kishoreganj, Manikganj, Munshiganj, Narsingdi, Faridpur, Gopalganj, Madaripur, Rajbari, Shariatpur, Brahmanbaria, Chandpur, Feni, Habiganj, Lakshmipur, Moulvibazar, Noakhali, Sunamganj, Bogra, Chapainawabganj, Joypurhat, Naogaon, Natore, Nawabganj, Pabna, Sirajganj, Bagerhat, Chuadanga, Jessore, Jhenaidah, Kushtia, Magura, Meherpur, Narail, Satkhira, Barguna, Bhola, Jhalokati, Patuakhali, Pirojpur, Dinajpur, Gaibandha, Kurigram, Lalmonirhat, Nilphamari, Panchagarh, Thakurgaon, Bandarban, Khagrachhari, Rangamati, Netrokona, Sherpur)
- Add a `Train` mock ticket or two to `mockTickets`

**2. `src/components/SellTicketModal.tsx`**
- Add `Train` option to vehicle type select: `🚆 Train`
- Add new `operatorName` text input field (labeled "Operator/Service Name") with placeholder examples like "Greenline, Biman, Sonar Bangla Express..."
- Include `operatorName` in the submitted ticket object
- The city dropdown will automatically show all 64 districts since it reads from `Object.keys(cities)`

**3. `src/components/TicketCard.tsx`**
- Add `Train` to `vehicleIcons` mapping using `TrainFront` from lucide-react
- Display `ticket.operatorName` if present (shown below vehicle type badge)

