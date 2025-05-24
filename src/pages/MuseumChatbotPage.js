const MuseumChatbotPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-center text-blue-800">Smart Museum Chatbot</h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-2xl">
        Welcome to our AI-powered multilingual ticket booking chatbot. Book your museum tickets easily in English, Hindi, Tamil, or Telugu!
      </p>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 shadow-xl">Start Chatbot</button>
    </div>
  );
};

export default MuseumChatbotPage;
