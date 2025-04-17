import CityLayout from "../components/CityLayout";

const mumbaiInfo = {
  cityName: "Mumbai",
  videoSrc: "/videos/mumbai.mp4",
  about: "Mumbai, the city of dreams, is India's financial capital and home to Bollywood. It is famous for its beaches, bustling streets, and colonial architecture.",
  places: [
    { name: "Gateway of India", image: "/images/mumbai1.jpg", desc: "Iconic arch monument by the sea." },
    { name: "Marine Drive", image: "/images/mumbai2.jpg", desc: "Scenic promenade known as the 'Queen's Necklace'." },
    { name: "Elephanta Caves", image: "/images/mumbai3.jpg", desc: "Ancient rock-cut caves with sculptures." },
    { name: "Chhatrapati Shivaji Terminus", image: "/images/mumbai4.jpg", desc: "Historic railway station and UNESCO site." },
    { name: "Juhu Beach", image: "/images/mumbai5.jpg", desc: "Popular beach destination." },
    { name: "Siddhivinayak Temple", image: "/images/mumbai6.jpg", desc: "Famous temple dedicated to Lord Ganesha." },
  ]
};

export default function MumbaiPage() {
  return <CityLayout {...mumbaiInfo} />;
}