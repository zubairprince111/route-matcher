import { LocalFareReporter } from "@/components/LocalFareReporter";

const LocalRates = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <LocalFareReporter open={true} onClose={() => { }} pageMode={true} />
        </div>
    );
};

export default LocalRates;
