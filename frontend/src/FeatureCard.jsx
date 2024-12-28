import FeatureBottom from "./FeatureBottom";
import "./Feature.css";

function FeatureCard({ title,idx }) {
  
    let description = [
        "Hosts can rent out properties or provide unique experiences, such as local tours, cooking classes, or outdoor adventures.",
        "Leverages user-generated content such as reviews and ratings to build a trustworthy community.",
        "Makes the booking process transparent for both guests and hosts.",
        "User-friendly interface supports secure payments and flexible booking options.",
        "Intuitive search feature allows users to filter based on location, price, amenities, and preferences.",
        "Affordable alternative to traditional hotel stays offering personalized and memorable travel experiences.",
        "Revolutionizes travel by providing not just a place to stay but also authentic local experiences."
    ];
    

    return (
        <div className="FeatureCard">
            <h4>{title}</h4>
            
                {description[idx]}
              
          
            <FeatureBottom/>
        </div>
    );
}

export default FeatureCard;
