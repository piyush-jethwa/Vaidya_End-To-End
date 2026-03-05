import React from 'react';
import ChatInterface from '../components/VaidyaAgent/ChatInterface';

const ChatAssistant: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto p-4">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatAssistant;

