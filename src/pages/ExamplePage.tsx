
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';

const ExamplePage = () => {
  const navigate = useNavigate();
  
  // Placeholder data for the example story
  const exampleStory = {
    title: "Alex's Space Adventure",
    pages: [
      { image: "/placeholder.svg", text: "Meet Alex! Today is a very special day. Alex is going on a big adventure to outer space!" },
      { image: "/placeholder.svg", text: "Alex puts on a shiny space suit and a helmet with stars on it. Ready for takeoff!" },
      { image: "/placeholder.svg", text: "3... 2... 1... BLAST OFF! Alex's rocket zooms up into the sky, way past the clouds." },
      { image: "/placeholder.svg", text: "In space, Alex sees the Earth below. It looks like a blue and green marble floating in the darkness." },
      { image: "/placeholder.svg", text: "Alex visits the Moon first. It's covered in gray dust and has big holes called craters." },
      { image: "/placeholder.svg", text: "'I wonder if anyone lives here,' thinks Alex. But the Moon is very quiet." },
      { image: "/placeholder.svg", text: "Next, Alex flies to Mars, the red planet. It has mountains taller than any on Earth!" },
      { image: "/placeholder.svg", text: "On the way home, Alex sees a shooting star. 'Make a wish!' Alex closes eyes and wishes." },
      { image: "/placeholder.svg", text: "Back on Earth, Alex tells everyone about the amazing space journey. 'Next time,' says Alex, 'I want to visit Saturn!'" },
      { image: "/placeholder.svg", text: "That night, Alex dreams of more adventures among the stars. The universe is full of wonders waiting to be discovered." },
    ]
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-select">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-persimmon mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </button>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-4">{exampleStory.title}</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  This is an example of a personalized storybook. Create your own unique story with your child as the main character!
                </p>
              </div>
              
              <div className="flex justify-center mb-8">
                <Button onClick={() => navigate('/wizard')} size="lg">
                  Create Your Own Story
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {exampleStory.pages.map((page, index) => (
                  <div key={index} className="flex flex-col rounded-lg overflow-hidden shadow-sm border">
                    <div className="h-60 bg-gray-100">
                      <img 
                        src={page.image} 
                        alt={`Page ${index + 1}`} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-sm text-gray-500 mb-2">Page {index + 1}</p>
                      <p className="text-sm">{page.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-12">
                <Button onClick={() => navigate('/wizard')} size="lg">
                  Create Your Own Story
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExamplePage;
