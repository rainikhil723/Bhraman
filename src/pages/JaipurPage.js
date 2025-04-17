import CityLayout from "../components/CityLayout";

const jaipurInfo = {
  cityName: "Jaipur",
  videoSrc: "/videos/jaipur.webm",
  about: "Jaipur, known as the Pink City, is famous for its historic forts, palaces, and vibrant culture. It showcases the royal heritage of Rajasthan.",
  places: [
    { name: "Amber Fort", image: "/images/jaipur1.jpg", desc: "Majestic fort known for artistic style elements." },
    { name: "Hawa Mahal", image: "/images/jaipur2.jpg", desc: "Iconic 'Palace of Winds' with unique architecture." },
    { name: "City Palace", image: "/images/jaipur3.jpg", desc: "Historic royal residence with museums." },
    { name: "Jantar Mantar", image: "/images/jaipur4.jpg", desc: "UNESCO World Heritage astronomical observatory." },
    { name: "Nahargarh Fort", image: "/images/jaipur5.jpg", desc: "Fort offering panoramic views of Jaipur." },
    { name: "Albert Hall Museum", image: "/images/jaipur6.jpg", desc: "Museum showcasing Indo-Saracenic architecture and artifacts." },
  ]
};

export default function JaipurPage() {
  return <CityLayout {...jaipurInfo} />;
}