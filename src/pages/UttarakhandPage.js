import CityLayout from "../components/CityLayout";

const uttarakhandInfo = {
  cityName: "Uttarakhand",
  videoSrc: "/videos/uttarakhand.webm",
  about: "Uttarakhand, often referred to as the 'Land of the Gods', is famous for its pilgrimage sites, beautiful hill stations, and breathtaking landscapes in the Himalayas.",
  places: [
    { name: "Haridwar", image: "/images/uttarakhand1.jpg", desc: "Spiritual city on the banks of the Ganges River." },
    { name: "Rishikesh", image: "/images/uttarakhand2.jpg", desc: "Yoga capital of the world, famous for adventure sports." },
    { name: "Nainital", image: "/images/uttarakhand3.jpg", desc: "Charming hill station with a beautiful lake." },
    { name: "Mussoorie", image: "/images/uttarakhand4.jpg", desc: "Popular hill station known as the 'Queen of Hills'." },
    { name: "Kedarnath Temple", image: "/images/uttarakhand5.jpg", desc: "Sacred Hindu temple dedicated to Lord Shiva." },
    { name: "Valley of Flowers", image: "/images/uttarakhand6.jpg", desc: "Stunning national park with diverse flora." },
  ]
};

export default function UttarakhandPage() {
  return <CityLayout {...uttarakhandInfo} />;
}