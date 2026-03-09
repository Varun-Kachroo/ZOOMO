import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  fetchDriverMe,
  sendHeartbeat,
  sendDriverLocation,
} from "../services/driverApi";

const DriverAuthContext = createContext(null);

export function DriverAuthProvider({ children }) {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  const heartbeatRef = useRef(null);

  /* ===========================
     LOCAL AVAILABILITY UPDATE
     (OPTIMISTIC UI)
  ============================ */
  const updateDriverAvailabilityLocally = (isAvailable) => {
    setDriver((prev) =>
      prev ? { ...prev, isAvailable } : prev
    );

    const stored = localStorage.getItem("driver");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.isAvailable = isAvailable;
        localStorage.setItem(
          "driver",
          JSON.stringify(parsed)
        );
      } catch {}
    }
  };

  /* ===========================
     INITIAL SESSION RESTORE
  ============================ */
  useEffect(() => {
    const token = localStorage.getItem("driverToken");

    if (!token) {
      setLoading(false);
      return;
    }

    const syncDriver = async () => {
      try {
        const data = await fetchDriverMe();
        setDriver(data);
        localStorage.setItem("driver", JSON.stringify(data));

        if (data.isAvailable) {
          startHeartbeat();
        }
      } catch {
        hardLogout();
      } finally {
        setLoading(false);
      }
    };

    syncDriver();

    return () => stopHeartbeat();
  }, []);

  /* ===========================
     HEARTBEAT
  ============================ */
  const startHeartbeat = () => {
    if (heartbeatRef.current) return;

    heartbeatRef.current = setInterval(() => {
      sendHeartbeat().catch(() => {
        console.warn("Heartbeat failed");
      });
    }, 60_000);
  };

  const stopHeartbeat = () => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  };

  /* ===========================
     LIVE LOCATION TRACKING
  ============================ */
  useEffect(() => {
    if (!driver?.isAvailable) return;

    let watchId;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          sendDriverLocation(
            pos.coords.latitude,
            pos.coords.longitude
          );
        },
        () => {},
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [driver?.isAvailable]);

  /* ===========================
     AUTH ACTIONS
  ============================ */
  const login = (data) => {
    setDriver(data.driver);
    localStorage.setItem("driver", JSON.stringify(data.driver));
    localStorage.setItem("driverToken", data.accessToken);

    if (data.driver.isAvailable) {
      startHeartbeat();
    }
  };

  const hardLogout = () => {
    stopHeartbeat();
    setDriver(null);
    localStorage.removeItem("driver");
    localStorage.removeItem("driverToken");
  };

  const logout = () => {
    hardLogout();
  };

  /* ===========================
     TAB CLOSE HANDLING
  ============================ */
  useEffect(() => {
    const handleUnload = () => {
      stopHeartbeat();
    };

    window.addEventListener("beforeunload", handleUnload);
    return () =>
      window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return (
    <DriverAuthContext.Provider
      value={{
        driver,
        isAuthenticated: !!driver,
        loading,
        login,
        logout,
        updateDriverAvailabilityLocally,
      }}
    >
      {children}
    </DriverAuthContext.Provider>
  );
}

export function useDriverAuth() {
  return useContext(DriverAuthContext);
}
