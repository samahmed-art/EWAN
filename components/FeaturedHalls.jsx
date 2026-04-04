import React from "react";
import HallCard from "./HallCard";

export default function FeaturedHalls() {
  const halls = [
    { id: 1, name: "قاعة الريان", capacity: 500, location: "الشرج", price: "10,000" },
    { id: 2, name: "قاعة الريان", capacity: 500, location: "الشرج", price: "10,000" },
    { id: 3, name: "قاعة الريان", capacity: 500, location: "الشرج", price: "10,000" },
    { id: 4, name: "قاعة الريان", capacity: 500, location: "الشرج", price: "10,000" },
    { id: 5, name: "قاعة الريان", capacity: 500, location: "الشرج", price: "10,000" },
    { id: 6, name: "قاعة الريان", capacity: 500, location: "الشرج", price: "10,000" },
  ];

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ewan-blue mb-3">قاعاتنا</h2>
          <p className="text-gray-500 font-medium">أكثر من 50 قاعة للفعاليات والمناسبات الخاصة</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {halls.map((hall) => (
            <HallCard 
              key={hall.id}
              image={`https://via.placeholder.com/400x300/e2e8f0/384252?text=Hall+${hall.id}`}
              name={hall.name}
              capacity={hall.capacity}
              location={hall.location}
              price={hall.price}
              isFeatured={true}
            />
          ))}
        </div>
        
        <div className="mt-14 text-center">
          <button className="bg-ewan-gold text-white font-bold py-3.5 px-12 rounded-md hover:bg-[#b59837] shadow-md transition-colors text-lg">
            تصفح أكثر
          </button>
        </div>
      </div>
    </section>
  );
}
