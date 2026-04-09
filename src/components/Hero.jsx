import { useNavigate } from "react-router-dom";
import heroBg from "../assets/imgs/hero-bg.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        flex min-h-70 w-full flex-col justify-end rounded-2xl border border-(--line) 
        bg-cover bg-center p-5 shadow-lg sm:min-h-85 sm:p-8
      "
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <h1 className="max-w-2xl text-2xl font-bold text-white sm:text-4xl">
        Plan Your Meals Effortlessly
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-gray-100 sm:text-base">
        Simplify your daily routine. Plan your meals, reduce stress, and build
        healthier eating habits - all in one place.
      </p>

      <button
        onClick={() => navigate("/meals")}
        className="
          mt-4 w-fit rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold 
          text-[#2f2710] transition hover:bg-(--accent-strong)
        "
      >
        Get Started
      </button>
    </div>
  );
};

