import CityLayout from "../components/CityLayout";

const varanasiInfo = {
  cityName: "Varanasi",
  videoSrc: "/videos/varanasi.mp4",
  about: "Varanasi, the spiritual capital of India, is one of the world's oldest living cities, known for its ghats, temples, and sacred Ganges River.",
  places: [
    { name: "Dashashwamedh Ghat", image: "/images/varanasi1.jpg", desc: "Famous ghat for evening Ganga Aarti." },
    { name: "Kashi Vishwanath Temple", image: "/images/varanasi2.webp", desc: "One of the holiest Hindu temples dedicated to Lord Shiva." },
    { name: "Sarnath", image: "/images/varanasi3.webp", desc: "Buddhist pilgrimage site where Buddha gave his first sermon." },
    { name: "Assi Ghat", image: "/images/varanasi4.jpg", desc: "Popular ghat for pilgrims and tourists." },
    { name: "Ramnagar Fort", image: "/images/varanasi5.jpg", desc: "Historic fort and museum on the banks of Ganga." },
    { name: "Manikarnika Ghat", image: "/images/varanasi6.jpg", desc: "Sacred cremation ghat of Hindus." },
  ]
};

export default function VaranasiPage() {
  return <CityLayout {...varanasiInfo} />;
}
