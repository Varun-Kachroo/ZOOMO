import { FiArrowRight } from "react-icons/fi";

export default function PortalCard({
  icon,
  title,
  description,
  buttonText,
  href,
  gradient,
  badge,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer animate-slide-up"
    >
      {badge && (
        <span className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {badge}
        </span>
      )}

      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${gradient}`}
      >
        {icon}
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>

      <p className="text-gray-400 text-sm leading-relaxed mb-8">
        {description}
      </p>

      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 group-hover:gap-4 transition-all">
        {buttonText}
        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
}
