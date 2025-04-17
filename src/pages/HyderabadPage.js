import CityLayout from "../components/CityLayout";

const hyderabadInfo = {
  cityName: "Hyderabad",
  videoSrc: "/videos/hyderabad.mp4",
  about: "Hyderabad, the City of Pearls, blends historic charm, regal cuisine, and modern tech with the grandeur of Nizami culture.",
  places: [
    { name: "Charminar", image: "/images/hyd1.jpg", desc: "Iconic 16th-century monument with four grand arches." },
    { name: "Golconda Fort", image: "/images/hyd2.jpg", desc: "Ancient fort known for acoustic architecture." },
    { name: "Hussain Sagar Lake", image: "/images/hyd3.jpg", desc: "Man-made lake with Buddha statue at the center." },
    { name: "Chowmahalla Palace", image: "/images/hyd4.jpg", desc: "Royal residence of the Nizams." },
    { name: "Ramoji Film City", image: "/images/hyd5.jpg", desc: "World’s largest integrated film studio complex." },
    { name: "Shilparamam", image: "/images/hyd6.jpg", desc: "Cultural village celebrating arts and crafts." },
  ]
};

export default function HyderabadPage() {
  return <CityLayout {...hyderabadInfo} />;
}