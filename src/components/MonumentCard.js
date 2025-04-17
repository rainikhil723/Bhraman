// src/components/MonumentCard.js
export default function MonumentCard({ name, image, desc }) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h4 className="text-xl font-bold text-blue-600">{name}</h4>
          <p className="text-gray-700 text-sm">{desc}</p>
        </div>
      </div>
    );
  }
  