import CityLayout from "../components/CityLayout";

const bengaluruInfo = {
  cityName: "Bengaluru",
  videoSrc: "/videos/bengaluru.mp4",
  about: "Bengaluru, India's Silicon Valley, offers a blend of tech innovation, cool climate, and a lively cultural scene.",
  places: [
    { name: "Lalbagh Botanical Garden", image: "/images/beng1.jpg", desc: "Sprawling garden with a glasshouse and rare plants." },
    { name: "Cubbon Park", image: "/images/beng2.jpg", desc: "Lush green escape in the heart of the city." },
    { name: "Bangalore Palace", image: "/images/beng3.jpg", desc: "Palace inspired by England’s Windsor Castle." },
    { name: "ISKCON Temple", image: "/images/beng4.jpg", desc: "Large temple dedicated to Lord Krishna." },
    { name: "UB City Mall", image: "/images/beng5.jpg", desc: "Luxury shopping destination." },
    { name: "Nandi Hills", image: "/images/beng6.jpg", desc: "Scenic sunrise point outside the city." },
  ]
};

export default function BengaluruPage() {
  return <CityLayout {...bengaluruInfo} />;
}