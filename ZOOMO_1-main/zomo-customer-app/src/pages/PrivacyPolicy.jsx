import { useNavigate } from "react-router-dom";

const C = {
    page: "#F4F7F5", surface: "#FFFFFF", primary: "#0F3D2D", hover: "#164A39",
    accent: "#1F7A52", textMain: "#0C1612", textSub: "#6B7280", textMuted: "#9CA3AF",
    border: "#DCE6E0", borderSoft: "#EEF3F0",
};

const LOGO_URL = "https://res.cloudinary.com/dx2qaarhy/image/upload/v1789420327/2bb606dc-2292-40ba-a4e8-df6720a3b700.png";

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: C.textMain, marginBottom: 10, letterSpacing: "-0.01em" }}>
                {title}
            </h2>
            <div style={{ fontSize: 14.5, color: C.textSub, lineHeight: "24px" }}>
                {children}
            </div>
        </div>
    );
}

export default function PrivacyPolicy() {
    const navigate = useNavigate();
    const lastUpdated = "September 21, 2026";

    return (
        <div style={{ minHeight: "100vh", background: C.page, fontFamily: "'Satoshi', system-ui, sans-serif" }}>
            <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');
        * { box-sizing: border-box; }
        body { background: ${C.page} !important; }
      `}</style>

            {/* Header */}
            <header style={{
                background: C.surface, borderBottom: `1px solid ${C.borderSoft}`,
                padding: "18px 20px"
            }}>
                <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={LOGO_URL} alt="Zoomo Eats" style={{ height: 32, width: "auto", objectFit: "contain", cursor: "pointer" }}
                        onClick={() => navigate("/")} />
                    <span style={{ fontWeight: 700, fontSize: 16, color: C.textMain }}>Zoomo Eats</span>
                </div>
            </header>

            {/* Content */}
            <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px" }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: C.textMain, letterSpacing: "-0.02em", marginBottom: 8 }}>
                    Privacy Policy
                </h1>
                <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 40 }}>
                    Last updated: {lastUpdated}
                </p>

                <Section title="1. Who we are">
                    <p>
                        Zoomo Eats ("we", "us", "our") operates a food delivery platform connecting
                        customers with local restaurants for delivery, dine-in booking, and takeaway
                        ordering. This policy explains what information we collect through our
                        website and app, how we use it, and the choices you have.
                    </p>
                </Section>

                <Section title="2. Information we collect">
                    <p style={{ marginBottom: 10 }}>We collect the following categories of information:</p>
                    <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                        <li><strong style={{ color: C.textMain }}>Account information</strong> — name, email address, phone number, and password (or, if you sign in with Google, the name and email Google shares with us).</li>
                        <li><strong style={{ color: C.textMain }}>Delivery information</strong> — delivery addresses you save, and dine-in/takeaway booking details such as date, time, and guest count.</li>
                        <li><strong style={{ color: C.textMain }}>Order information</strong> — items ordered, order value, payment method selected, special instructions, and order history.</li>
                        <li><strong style={{ color: C.textMain }}>Reviews</strong> — ratings and comments you choose to leave for restaurants you've ordered from.</li>
                        <li><strong style={{ color: C.textMain }}>Usage information</strong> — pages visited and actions taken on our platform, used to keep the service running reliably and to improve it.</li>
                    </ul>
                </Section>

                <Section title="3. How we use your information">
                    <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                        <li>To create and manage your account, and to authenticate you (including via Google Sign-In).</li>
                        <li>To process and deliver your orders, and to communicate with you about them.</li>
                        <li>To let you book dine-in or takeaway slots with restaurants.</li>
                        <li>To show your reviews to other customers browsing a restaurant.</li>
                        <li>To maintain the security of our platform and prevent fraud or abuse.</li>
                        <li>To improve our service based on how it's actually used.</li>
                    </ul>
                </Section>

                <Section title="4. Sign in with Google">
                    <p>
                        If you choose to sign in or sign up using Google, we receive your name and
                        email address from Google to create or match your Zoomo Eats account. We do
                        not receive your Google password, and we do not post anything to your Google
                        account on your behalf. You can find Google's own privacy practices at{" "}
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
                            style={{ color: C.primary, fontWeight: 600 }}>policies.google.com/privacy</a>.
                    </p>
                </Section>

                <Section title="5. Who we share information with">
                    <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                        <li><strong style={{ color: C.textMain }}>Restaurants you order from</strong> — your name, order details, and delivery/dine-in information, so they can prepare and fulfill your order.</li>
                        <li><strong style={{ color: C.textMain }}>Cloudinary</strong> — used to host and serve images on our platform (restaurant and dish photos).</li>
                        <li><strong style={{ color: C.textMain }}>Google</strong> — used only to verify your identity if you choose Sign in with Google.</li>
                    </ul>
                    <p style={{ marginTop: 10 }}>
                        We do not sell your personal information to third parties.
                    </p>
                </Section>

                <Section title="6. Data retention">
                    <p>
                        We keep your account and order information for as long as your account is
                        active, so you can view your order history and reorder easily. If you'd like
                        your account and associated data deleted, contact us using the details below.
                    </p>
                </Section>

                <Section title="7. Your choices">
                    <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                        <li>You can update your name, phone number, and saved addresses at any time from your account.</li>
                        <li>You can request a copy of the personal data we hold about you.</li>
                        <li>You can request that we delete your account and associated personal data.</li>
                        <li>You can log out at any time, which removes your session from this device.</li>
                    </ul>
                </Section>

                <Section title="8. Security">
                    <p>
                        Passwords are stored using industry-standard hashing (they are never stored
                        or visible in plain text), and all traffic between your browser and our
                        servers is encrypted in transit.
                    </p>
                </Section>

                <Section title="9. Changes to this policy">
                    <p>
                        We may update this policy from time to time as our platform evolves. We'll
                        update the "Last updated" date above when we do. Continuing to use Zoomo Eats
                        after a change means you accept the updated policy.
                    </p>
                </Section>

                <Section title="10. Contact us">
                    <p>
                        If you have questions about this policy or want to exercise any of the choices
                        above, reach out to us at{" "}
                        <a href="mailto:zoomoeats@gmail.com" style={{ color: C.primary, fontWeight: 600 }}>
                            zoomoeats@gmail.com
                        </a>.
                    </p>
                </Section>

                <button onClick={() => navigate("/")}
                    style={{
                        marginTop: 20, padding: "11px 22px", borderRadius: 12, border: "none",
                        background: C.primary, color: "#fff", fontSize: 14, fontWeight: 600,
                        cursor: "pointer", fontFamily: "inherit"
                    }}>
                    ← Back to Zoomo Eats
                </button>
            </main>
        </div>
    );
}