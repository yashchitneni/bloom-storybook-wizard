
import { ArrowRight } from "lucide-react";
import Button from "./Button";

const HeroSection = () => {
  const scrollToWizard = () => {
    document.getElementById('wizard')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Turn Your Kid's Photo into a Magical Storybook 🌟
            </h1>
            <h4 className="text-lg text-gray-600">
              Upload one picture, pick a theme, receive a printable PDF adventure.
            </h4>
            <div>
              <Button onClick={scrollToWizard} size="lg" withArrow>
                Start My Book
              </Button>
            </div>
            
            {/* Trust Row */}
            <div className="pt-6">
              <p className="text-sm text-gray-500 mb-3">Trusted Technology</p>
              <div className="flex flex-wrap items-center gap-6">
                {['Stripe', 'Supabase', 'OpenAI'].map((brand) => (
                  <div key={brand} className="opacity-40 hover:opacity-60 transition-opacity duration-200">
                    <span className="font-medium">{brand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Content - Card Cluster */}
          <div className="relative min-h-[300px] md:min-h-[400px]">
            <div className="animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
              <div className="absolute md:top-0 md:left-10 top-2 left-2 w-64 h-80 bg-white rounded-2xl shadow-card transform rotate-3 overflow-hidden">
                <div className="h-full bg-sunshine flex items-center justify-center">
                  <span className="font-fredoka text-4xl">Book Cover</span>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
              <div className="absolute md:top-16 md:right-10 top-8 right-2 w-40 h-40 bg-white rounded-2xl shadow-card transform -rotate-6 overflow-hidden flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-4xl font-fredoka text-persimmon">5★</div>
                  <div className="mt-2 text-sm">Customer Rating</div>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in-scale" style={{ animationDelay: '0.5s' }}>
              <div className="absolute md:bottom-10 md:right-24 bottom-0 right-10 w-48 h-36 bg-white rounded-2xl shadow-card transform rotate-6 overflow-hidden flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-3xl font-fredoka text-mint">10+</div>
                  <div className="mt-1 text-sm">Pages per Book</div>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in-scale" style={{ animationDelay: '0.7s' }}>
              <div className="absolute md:bottom-24 md:left-4 bottom-8 left-2 w-36 h-36 bg-white rounded-2xl shadow-card transform -rotate-12 overflow-hidden flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-xl font-fredoka">2 Hour</div>
                  <div className="mt-1 text-sm">Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
