import { useEffect, useRef, useState } from "react";

// Reads from your customer app's .env — see setup instructions.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Renders Google's real "Sign in with Google" button using Google
 * Identity Services (the current official client-side flow — no popup
 * library needed, no extra npm package).
 *
 * Usage:
 *   <GoogleButton onCredential={(credential) => loginWithGoogle(credential)} />
 *
 * `onCredential` receives the raw Google ID token string. What you do
 * with it (log in vs sign up) is identical on the backend either way —
 * same endpoint, same result — so this one component works for both
 * the Login and Signup pages.
 */
export default function GoogleButton({ onCredential, onError }) {
  const btnRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(!!window.google?.accounts?.id);
  const [missingConfig, setMissingConfig] = useState(!GOOGLE_CLIENT_ID);

  // Load the GIS script once, even if both Login and Signup mount it
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return; // nothing to do, missingConfig already set
    if (window.google?.accounts?.id) { setScriptReady(true); return; }

    const existing = document.getElementById("google-identity-script");
    if (existing) {
      existing.addEventListener("load", () => setScriptReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.id = "google-identity-script";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () => onError?.("Could not load Google Sign-In. Check your connection.");
    document.body.appendChild(script);
  }, []);

  // Once the script is ready, initialize + render the real Google button
  useEffect(() => {
    if (!scriptReady || !GOOGLE_CLIENT_ID || !btnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (response?.credential) onCredential(response.credential);
        else onError?.("Google didn't return a credential. Try again.");
      },
    });

    window.google.accounts.id.renderButton(btnRef.current, {
      theme: "outline",
      size: "large",
      width: btnRef.current.offsetWidth || 320,
      text: "continue_with",
      shape: "rectangular",
    });
  }, [scriptReady]);

  if (missingConfig) {
    // Fails visibly during setup instead of silently doing nothing —
    // see the setup instructions for VITE_GOOGLE_CLIENT_ID.
    return (
      <div style={{ padding:"10px 14px", borderRadius:10, background:"#FEF3C7",
        border:"1px solid #FCD34D", fontSize:12, color:"#92400E", textAlign:"center" }}>
        Google Sign-In isn't configured yet (missing VITE_GOOGLE_CLIENT_ID).
      </div>
    );
  }

  return <div ref={btnRef} style={{ width:"100%", display:"flex", justifyContent:"center" }} />;
}
