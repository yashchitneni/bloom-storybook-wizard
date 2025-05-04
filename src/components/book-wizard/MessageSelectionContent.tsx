
import React from 'react';
import { motion } from 'framer-motion';

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
  // Message icons mapping
  const getMessageIcon = (message: string) => {
    switch (message) {
      case 'Friendship': return '🤝';
      case 'Courage': return '🦁';
      case 'Kindness': return '💖';
      case 'Learning': return '🧠';
      case 'Perseverance': return '🏆';
      case 'Honesty': return '✓';
      default: return '⭐';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Pick Your Story's Message</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-grow">
        {messages.map((message) => (
          <motion.button
            key={message}
            onClick={() => onSelectMessage(message)}
            className={`selection-card ${selectedMessage === message ? 'selected' : ''}`}
            whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="mb-3 text-2xl">
              {getMessageIcon(message)}
            </div>
            <span className="font-medium">{message}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="text-center text-gray-500 mt-8 italic text-sm">
        The moral or message helps shape your story's lesson
      </div>
    </div>
  );
};

export default MessageSelectionContent;
