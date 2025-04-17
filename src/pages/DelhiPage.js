import CityLayout from "../components/CityLayout";

const delhiInfo = {
  cityName: "Delhi",
  videoSrc: "/videos/delhi.mp4",
  about: "Delhi is the capital city of India, blending ancient traditions with modernity. It is home to iconic landmarks like India Gate, Qutub Minar, and the Red Fort.",
  places: [
    { name: "Red Fort", image: "/images/delhi1.jpg", desc: "Historic fort of Mughal era." },
    { name: "Qutub Minar", image: "/images/delhi2.jpg", desc: "Tallest brick minaret in the world." },
    { name: "India Gate", image: "/images/delhi3.jpg", desc: "War memorial and popular spot." },
    { name: "Lotus Temple", image: "/images/delhi4.jpg", desc: "Bahá'í House of Worship." },
    { name: "Akshardham", image: "/images/delhi5.jpg", desc: "Modern temple with cultural exhibitions." },
    { name: "Humayun’s Tomb", image: "/images/delhi6.jpg", desc: "Inspiration for the Taj Mahal." },
  ]
};

export default function DelhiPage() {
  return <CityLayout {...delhiInfo} />;
}
