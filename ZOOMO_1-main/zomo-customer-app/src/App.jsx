import {  Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppRoutes from "./routes/AppRoutes";
import ClickFeedback from "./components/ClickFeedback";
import BottomNav from "./components/BottomNav";



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

      {/* Mounted ONCE here, outside the route switch, so it never
          unmounts/remounts when navigating between pages — that's what
          makes the sliding indicator animate smoothly on every tab
          change, not just ones that stay within the same page/layout. */}
      <BottomNav />
    </>
  );
}
