import { FareReporter } from "@/components/FareReporter";

export default function VaraKoto() {
    return (
        <div className="w-full min-h-screen bg-background">
            <FareReporter open={true} onClose={() => { }} pageMode={true} />
        </div>
    );
}
