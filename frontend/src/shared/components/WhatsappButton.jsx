import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER
  const message = import.meta.env.VITE_WHATSAPP_MESSAGE

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-green-500 opacity-30 animate-ping"></span>
        <div className="w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center hover:scale-110 transition duration-300">
          <FaWhatsapp className="text-white text-3xl" />
        </div>

        <div className="absolute right-16 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
          Chat with us
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;