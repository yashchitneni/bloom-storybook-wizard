
import { ArrowRight } from "lucide-react";
import Button from "./Button";
import CardCluster from "./CardCluster";

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
          <div className="relative">
            <CardCluster />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
