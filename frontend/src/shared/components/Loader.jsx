import { LoaderCircle } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="flex flex-col items-center gap-3">
        <LoaderCircle
          size={40}
          className="animate-spin text-[#06A1B7]"
        />
        <p className="text-gray-500">{text}</p>
      </div>
    </div>
  );
};

export default Loader;