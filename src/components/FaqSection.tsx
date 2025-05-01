
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

const FaqItem = ({ question, answer, isOpen, toggleOpen }: FaqItemProps) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={toggleOpen}
      >
        <h3 className="font-medium text-lg">{question}</h3>
        <ChevronDown className={cn(
          "h-5 w-5 text-gray-500 transition-transform duration-300",
          isOpen && "transform rotate-180"
        )} />
      </button>
      
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 mt-2",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <p className="text-gray-600 pb-2">{answer}</p>
      </div>
    </div>
  );
};

const FaqSection = () => {
  const faqs = [
    {
      question: "How do you ensure the security of my child's photo?",
      answer: "We take your privacy seriously. Your photos are securely stored, processed for book creation only, and deleted after 30 days. We never share your images with third parties."
    },
    {
      question: "How long does it take to receive my PDF?",
      answer: "Your personalized PDF storybook will be delivered to your email within 2 hours of purchase. Most orders are completed in under 60 minutes!"
    },
    {
      question: "Can I print the book myself or order a physical copy?",
      answer: "Absolutely! Your PDF is high-resolution and print-ready. You can print it at home or use any local or online printing service. We're adding a direct hardcover printing option soon."
    },
    {
      question: "What if I'm not satisfied with my storybook?",
      answer: "We offer a 100% satisfaction guarantee. If you're not happy with your storybook, we'll revise it according to your feedback or provide a full refund."
    },
    {
      question: "Are books available in languages other than English?",
      answer: "Currently, we offer storybooks in English, Spanish, and French. More languages will be added soon based on customer requests."
    },
    {
      question: "Who owns the copyright to my child's storybook?",
      answer: "You retain full ownership rights to your personalized storybook. You're free to print, share, and use the PDF for personal purposes."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="mt-2 text-gray-600">Everything you need to know about StoryBloom</p>
        </div>
        
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleFaq(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
