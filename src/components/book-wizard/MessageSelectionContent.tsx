
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MessageSelectionContentProps {
  selectedMessage: string;
  onSelectMessage: (message: string) => void;
  messages: string[];
}

const MessageSelectionContent: React.FC<MessageSelectionContentProps> = ({
  selectedMessage,
  onSelectMessage,
  messages
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Pick Your Story's Message</h1>
      
      <div className="relative flex-grow">
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md"
          onClick={() => scroll('left')}
        >
          <ChevronLeft />
        </button>
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 py-2 px-6 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {messages.map((message) => (
            <motion.div
              key={message}
              className={`
                flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-xl w-[160px] h-[160px] text-center
                ${selectedMessage === message 
                  ? 'bg-persimmon/10 border-2 border-persimmon' 
                  : 'bg-white border-2 border-gray-200 hover:border-persimmon/50'}
                transition-all duration-200 cursor-pointer
              `}
              onClick={() => onSelectMessage(message)}
              whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="mb-3 text-2xl">
                {message === 'Friendship' ? '🤝' : 
                 message === 'Courage' ? '🦁' : 
                 message === 'Kindness' ? '💖' : 
                 message === 'Learning' ? '🧠' : '⭐'}
              </div>
              <span className="font-medium">{message}</span>
            </motion.div>
          ))}
        </div>
        
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md"
          onClick={() => scroll('right')}
        >
          <ChevronRight />
        </button>
      </div>
      
      <div className="text-center text-gray-500 mt-8 italic text-sm">
        The moral or message helps shape your story's lesson
      </div>
    </div>
  );
};

export default MessageSelectionContent;
