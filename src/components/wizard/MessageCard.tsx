
import React from 'react';
import { motion } from "framer-motion";

interface MessageCardProps {
  onSelectMessage: (message: string) => void;
  selectedMessage: string;
  messages: string[];
  isActive: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({ 
  onSelectMessage, 
  selectedMessage,
  messages,
  isActive
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {messages.map((message) => (
        <motion.div 
          key={message}
          onClick={() => onSelectMessage(message)}
          className={`
            p-3 border-2 rounded-xl cursor-pointer text-center aspect-[6/5] flex items-center justify-center
            transition-all duration-300 hover:shadow-md
            ${selectedMessage === message 
              ? "border-persimmon bg-rose-50 shadow-lg" 
              : "border-gray-200 shadow-sm hover:border-persimmon/30"}
          `}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className={`font-medium ${selectedMessage === message ? "text-persimmon" : "text-gray-800"}`}>
            {message}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default MessageCard;
