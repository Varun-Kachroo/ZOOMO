import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);

  return (
    <OnboardingContext.Provider
      value={{ restaurant, setRestaurant }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
