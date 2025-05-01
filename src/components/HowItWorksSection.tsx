
import Card from "./Card";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: "📸",
      title: "Snap & Upload",
      description: "Choose a favorite photo of your child to be the star of their story."
    },
    {
      icon: "🪄",
      title: "Pick Adventure",
      description: "Select a theme, moral, and art style for a personalized experience."
    },
    {
      icon: "📚",
      title: "Get PDF",
      description: "Receive your printable storybook PDF within 2 hours via email."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="mt-2 text-gray-600">Creating personalized stories in three simple steps</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center" hoverEffect>
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
