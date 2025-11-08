const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 rounded-2xl p-8 md:p-10 overflow-hidden shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          AI Career Coach Agent
        </h1>
        <p className="text-white/90 text-base md:text-lg mb-6 max-w-3xl leading-relaxed">
          Smarter career decisions start here — get tailored advice, real-time market insights, 
          and a roadmap built just for you with the power of AI.
        </p>
        <button className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200">
          Let's Get Started
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-20 h-20 border-4 border-white/20 rounded-2xl rotate-12 hidden md:block"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-white/20 rounded-full hidden md:block"></div>
    </div>
  );
};

export default HeroSection;
