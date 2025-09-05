

// export default function Hero() {
//   return (
//     <section className="relative bg-gradient-to-b from-[#f7f5f2] to-[#f0ede6] text-gray-900 min-h-screen flex items-center overflow-hidden">
//       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615634376658-7d0cd2f60ee9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center mix-blend-overlay opacity-10"></div>

//       <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24 relative z-10">

//         {/* Left Text Content */}
//         <div className="flex-1 text-center lg:text-left">
//           <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">Exclusive Collection</p>
//           <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif font-normal tracking-wide mb-6 leading-tight">
//             The Essence of <span className="italic font-light text-gray-700 block mt-2">Timeless Elegance</span>
//           </h1>
//           <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
//             Immerse yourself in the artistry of scent. Each fragrance is meticulously crafted to tell a story of luxury, sophistication, and unforgettable moments.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//             <button className="bg-black text-white px-8 py-3 rounded-sm hover:bg-gray-800 transition duration-500 text-sm tracking-widest uppercase font-light">
//               Discover Now
//             </button>
//             <button className="border border-gray-800 text-gray-800 px-8 py-3 rounded-sm hover:bg-gray-800 hover:text-white transition duration-500 text-sm tracking-widest uppercase font-light">
//               Our Story
//             </button>
//           </div>
//         </div>

//         {/* Right Image */}
//         <div className="flex-1 flex justify-center relative">
//           <div className="relative w-full max-w-md">
//             <div className="absolute -inset-8 bg-gradient-to-br from-white/20 to-transparent rounded-2xl transform rotate-3"></div>
//             <img
//               src="/perfume.png"
//               alt="Luxury Perfume Bottle"
//               className="relative rounded-lg shadow-2xl w-full object-cover z-10"
//               loading="eager"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }





























































import { useState, useEffect } from "react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      bgImage: "./perfume1.png",
      title: "The Essence of",
      subtitle: "Timeless Elegance",
      description:
        "Immerse yourself in the artistry of scent. Each fragrance is meticulously crafted to tell a story of luxury, sophistication, and unforgettable moments.",
    },
    {
      id: 2,
      bgImage: "./perfume2.png",
      title: "Crafted from",
      subtitle: "Rare Ingredients",
      description:
        "Sourced from the world's most exclusive regions, our ingredients create an olfactory experience unlike any other.",
    },
    {
      id: 3,
      bgImage: "./perfume3.png",
      title: "An Olfactory",
      subtitle: "Masterpiece",
      description:
        "Experience the perfect harmony of top, middle and base notes that evolve throughout your day.",
    },

    {
      id: 4,
      bgImage: "./perfume4.png",
      title: "Essence of Elegance",
      subtitle: "Redefining Luxury",
      description:
        "Immerse yourself in an exquisite blend of rare ingredients, crafted for timeless sophistication.",
    },
  ];


  const changeSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((index + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 800);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      changeSlide(currentSlide + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => changeSlide(currentSlide + 1);
  const prevSlide = () => changeSlide(currentSlide - 1);
  const goToSlide = (index) => {
    if (index !== currentSlide) changeSlide(index);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.bgImage})` }}
          ></div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Navigation Arrows - Hidden on mobile, visible on larger screens */}
      <button
        onClick={prevSlide}
        className="hidden md:block absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-30 text-white/70 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 lg:w-8 lg:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:block absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-30 text-white/70 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 lg:w-8 lg:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-24 relative z-20 w-full">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left w-full">
          <div
            className={`transition-all duration-700 ease-out ${
              isTransitioning
                ? "translate-y-6 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80 mb-3 sm:mb-4">
              Exclusive Collection
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light mb-4 sm:mb-6 leading-tight text-white">
              {slides[currentSlide].title}{" "}
              <span className="italic block mt-1 sm:mt-2 font-extralight">
                {slides[currentSlide].subtitle}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed font-light">
              {slides[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button className="bg-white text-gray-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-sm hover:bg-gray-50 transition-all duration-300 text-xs sm:text-sm tracking-widest uppercase font-light">
                Discover Now
              </button>
              <button className="border border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-sm hover:bg-white/10 transition-all duration-300 text-xs sm:text-sm tracking-widest uppercase font-light">
                Our Story
              </button>
            </div>
          </div>
        </div>

        {/* Perfume Bottle Image - Hidden on smallest screens, visible on medium and up */}
        <div className="flex-1 flex justify-center relative mt-8 lg:mt-0 w-full max-w-xs sm:max-w-sm md:max-w-md">
          <div className="relative w-full">
            <div className="absolute -inset-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl transform rotate-3"></div>
            <img
              src={slides[currentSlide].bgImage}
              alt="Luxury Perfume Bottle"
              className={`relative rounded-lg w-full object-contain z-10 transition-all duration-700 ${
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-amber-400/30 to-amber-600/40 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Slide Indicators - Positioned better for mobile */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Brand Signature - Better responsive positioning */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
        <svg
          className="h-8 sm:h-10 md:h-12 w-auto text-white"
          viewBox="0 0 100 40"
          fill="currentColor"
        >
          <path d="M20,10 C30,5 40,15 50,10 C60,5 70,15 80,10 C85,7 90,12 95,10 L95,25 C90,27 85,22 80,25 C70,30 60,20 50,25 C40,30 30,20 20,25 C15,27 10,22 5,25 L5,10 C10,7 15,12 20,10 Z" />
        </svg>
      </div>
    </section>
  );
}
