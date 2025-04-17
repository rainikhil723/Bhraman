// src/pages/UdaipurPage.js

import CityLayout from "../components/CityLayout";

const udaipurInfo = {
  cityName: "Udaipur",
  videoSrc: "/videos/udaipur.mp4",
  about: "Udaipur, known as the 'City of Lakes', is a beautiful city in Rajasthan famous for its history, culture, and scenic locations.",
  places: [
    {
      name: "City Palace",
      image: "/images/udaipur1.jpg",
      desc: "A majestic architectural marvel located on the banks of Lake Pichola."
    },
    {
      name: "Lake Pichola",
      image: "/images/udaipur2.jpg",
      desc: "A serene lake offering boat rides and views of palaces and temples."
    },
    {
      name: "Jagdish Temple",
      image: "/images/udaipur3.jpg",
      desc: "An Indo-Aryan temple dedicated to Lord Vishnu."
    },
    {
      name: "Fateh Sagar Lake",
      image: "/images/udaipur4.jpg",
      desc: "Another picturesque lake surrounded by hills and a popular hangout spot."
    },
    {
      name: "Saheliyon Ki Bari",
      image: "/images/udaipur5.jpg",
      desc: "A beautiful garden with fountains, lotus pools, and marble pavilions."
    },
    {
      name: "Sajjangarh Palace",
      image: "/images/udaipur6.jpg",
      desc: "Also known as the Monsoon Palace, it offers panoramic views of the city and lakes."
    }
  ]
};

export default function UdaipurPage() {
  return <CityLayout {...udaipurInfo} />;
}
