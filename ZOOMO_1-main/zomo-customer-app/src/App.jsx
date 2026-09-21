import {  Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppRoutes from "./routes/AppRoutes";
import ClickFeedback from "./components/ClickFeedback";



export default function App() {
  return (
    <>
      <ClickFeedback />
          <Routes>

            {/* Landing page should be FULL WIDTH */}
            <Route path="/" element={<LandingPage />} />

            {/* Other pages inside your normal layout container */}
            <Route
              path="/*"
              element={
                <div className="max-w-4xl mx-auto px-4">
                  <AppRoutes />
                </div>
              }
            />

          </Routes>
    </>
  );
}
