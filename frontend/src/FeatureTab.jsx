import FeatureCard from "./FeatureCard";

function FeatureTab() {
 
    return (
        <div className="App">
            <FeatureCard title="Logitech MX Master" idx={0} />
            <FeatureCard title="Apple Pencil (2nd Gen)" idx={1} />
            <FeatureCard title="Zebronics Zeb Transformer" idx={2} />
            <FeatureCard title="Portronics Trod 23 Wireless Mouse" idx={3} />
        </div>
    );
}

export default FeatureTab;
