import CityLayout from "../components/CityLayout";

const amritsarInfo = {
  cityName: "Amritsar",
  videoSrc: "/videos/amritsar.mp4",
  about: "Amritsar, the spiritual center of Sikhism, is known for its golden shrine, soulful devotion, and vibrant Punjabi culture.",
  places: [
    { name: "Golden Temple", image: "/images/amritsar1.jpg", desc: "Spiritual heart of Sikhism and serene holy site." },
    { name: "Jallianwala Bagh", image: "/images/amritsar2.jpg", desc: "Historic garden with a somber legacy." },
    { name: "Wagah Border", image: "/images/amritsar3.jpg", desc: "India-Pakistan border known for patriotic ceremony." },
    { name: "Partition Museum", image: "/images/amritsar4.jpg", desc: "Museum depicting stories from the 1947 partition." },
    { name: "Gobindgarh Fort", image: "/images/amritsar5.jpg", desc: "Restored fort with cultural attractions." },
    { name: "Maharaja Ranjit Singh Museum", image: "/images/amritsar6.jpg", desc: "Museum honoring the Lion of Punjab." },
  ]
};

export default function AmritsarPage() {
  return <CityLayout {...amritsarInfo} />;
}