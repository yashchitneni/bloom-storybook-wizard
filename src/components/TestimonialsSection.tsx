
import Card from "./Card";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "My son couldn't stop reading his personalized adventure book! The illustrations captured his likeness perfectly.",
      author: "Sarah T.",
      rating: 5
    },
    {
      quote: "The quality of the story and illustrations exceeded my expectations. My daughter absolutely loves being the main character!",
      author: "Michael K.",
      rating: 5
    },
    {
      quote: "What a wonderful gift for my nephew. The PDF was delivered quickly and looks professional enough to be sold in stores!",
      author: "Jessica R.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-[#F3EFFF]">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">What Parents Say</h2>
          <p className="mt-2 text-gray-600">Join hundreds of happy families</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover-lift">
              <div className="flex flex-col h-full">
                <div className="mb-4 flex">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <blockquote className="flex-grow">
                  <p className="italic text-gray-600">"{testimonial.quote}"</p>
                </blockquote>
                
                <footer className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-medium">{testimonial.author}</p>
                </footer>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
