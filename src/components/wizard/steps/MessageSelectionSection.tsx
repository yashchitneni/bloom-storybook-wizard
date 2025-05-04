
import React from 'react';
import { motion } from "framer-motion";
import MessageCard from '@/components/wizard/MessageCard';

interface MessageSelectionSectionProps {
  onSelectMessage: (message: string) => void;
  selectedMessage: string;
  messages: string[];
  isActive: boolean;
}

const MessageSelectionSection: React.FC<MessageSelectionSectionProps> = ({
  onSelectMessage,
  selectedMessage,
  messages,
  isActive
}) => {
  return (
    <motion.section 
      id="step-4"
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl font-bold">What's the central message of the story?</h3>
      <MessageCard
        onSelectMessage={onSelectMessage}
        selectedMessage={selectedMessage}
        messages={messages}
        isActive={true}
      />
    </motion.section>
  );
};

export default MessageSelectionSection;
