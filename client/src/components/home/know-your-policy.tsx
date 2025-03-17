import { useLocation } from "wouter";

export default function KnowYourPolicy() {
  const [_, setLocation] = useLocation();

  const handleClick = () => {
    setLocation(`/service/67d7d0b9ba8af0c60c60b79e`);
  };

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div 
          onClick={handleClick}
          className="flex flex-col items-center justify-center cursor-pointer group transition-transform duration-300 hover:scale-105"
        >
          <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 transition-all duration-200 group-hover:bg-blue-100 shadow-md group-hover:shadow-xl border border-blue-100">
            <img
              src="/icons/car_ins.png"
              alt="Know Your Policy"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h3 className="text-xl font-semibold text-blue-950 text-center group-hover:text-blue-800 transition-colors duration-200">
            Know Your Policy
          </h3>
          <p className="text-sm text-gray-600 text-center mt-2 max-w-md">
            Get detailed insights and understanding of your insurance policy
          </p>
        </div>
      </div>
    </section>
  );
} 