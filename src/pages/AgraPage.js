import CityLayout from "../components/CityLayout";

const agraInfo = {
  cityName: "Agra",
  videoSrc: "/videos/agra.mp4",
  about: "Agra, home to the iconic Taj Mahal, is a city that beautifully captures the Mughal grandeur and historical richness of India.",
  places: [
    { name: "Taj Mahal", image: "/images/agra1.jpg", desc: "World-famous white marble mausoleum." },
    { name: "Agra Fort", image: "/images/agra2.jpg", desc: "Majestic fort and UNESCO World Heritage Site." },
    { name: "Fatehpur Sikri", image: "/images/agra3.jpg", desc: "Abandoned Mughal city known for stunning architecture." },
    { name: "Mehtab Bagh", image: "/images/agra4.jpg", desc: "Garden complex with perfect view of Taj Mahal." },
    { name: "Itmad-ud-Daulah's Tomb", image: "/images/agra5.jpg", desc: "Often called the 'Baby Taj'." },
    { name: "Akbar’s Tomb", image: "/images/agra6.jpg", desc: "Tomb of the great Mughal emperor Akbar." },
  ]
};

export default function AgraPage() {
  return <CityLayout {...agraInfo} />;
}