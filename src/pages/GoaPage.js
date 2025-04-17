import CityLayout from "../components/CityLayout";

const goaInfo = {
  cityName: "Goa",
  videoSrc: "/videos/goa.webm",
  about: "Goa, a coastal paradise, is known for its beautiful beaches, Portuguese heritage, vibrant nightlife, and laid-back vibe.",
  places: [
    { name: "Baga Beach", image: "/images/goa1.jpg", desc: "Lively beach with water sports and nightlife." },
    { name: "Basilica of Bom Jesus", image: "/images/goa2.jpg", desc: "Historic church and UNESCO World Heritage Site." },
    { name: "Fort Aguada", image: "/images/goa3.jpg", desc: "17th-century Portuguese fort overlooking the sea." },
    { name: "Anjuna Beach", image: "/images/goa4.jpg", desc: "Famous for its trance parties and flea markets." },
    { name: "Dudhsagar Falls", image: "/images/goa5.jpg", desc: "Spectacular four-tiered waterfall." },
    { name: "Calangute Beach", image: "/images/goa6.jpg", desc: "Largest beach in North Goa, ideal for sunbathing." },
  ]
};

export default function GoaPage() {
  return <CityLayout {...goaInfo} />;
}