import { Hero } from "../components/Hero";
import { MealsToday } from "../components/MealsToday";
import { UpcomingMeals } from "../components/UpcomingMeals";
import { DashboardGreeting } from "../components/DashboardGreeting";
import { useAuth } from "../hooks/useAuth";

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col space-y-4">
      <DashboardGreeting name={user?.username} />
      <Hero />
      <MealsToday />
      <UpcomingMeals />
    </div>
  );
};
