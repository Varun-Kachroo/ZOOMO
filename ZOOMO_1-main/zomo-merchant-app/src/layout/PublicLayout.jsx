
// src/layout/PublicLayout.jsx
export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      {children}
    </div>
  );
}
