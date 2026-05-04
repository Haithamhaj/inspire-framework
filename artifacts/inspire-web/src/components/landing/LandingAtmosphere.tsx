import { motion, useReducedMotion } from "framer-motion";

const AURORA_LAYERS = [
  {
    className: "left-[-12%] top-[8%] h-[560px] w-[560px] bg-rose-500/18",
    animate: { x: [0, 120, 40, 0], y: [0, 80, 180, 0], scale: [1, 1.15, 0.95, 1] },
    duration: 24,
  },
  {
    className: "right-[-16%] top-[18%] h-[640px] w-[640px] bg-violet-500/16",
    animate: { x: [0, -130, -50, 0], y: [0, 140, 260, 0], scale: [1, 0.9, 1.12, 1] },
    duration: 28,
  },
  {
    className: "left-[12%] top-[42%] h-[520px] w-[520px] bg-teal-500/12",
    animate: { x: [0, 180, 80, 0], y: [0, -80, 130, 0], scale: [1, 1.08, 0.9, 1] },
    duration: 31,
  },
  {
    className: "right-[8%] bottom-[7%] h-[500px] w-[500px] bg-amber-500/10",
    animate: { x: [0, -90, 40, 0], y: [0, -180, -70, 0], scale: [1, 1.16, 0.98, 1] },
    duration: 34,
  },
];

export function LandingAtmosphere() {
  const reduced = useReducedMotion() ?? false;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#070817]" />

      {AURORA_LAYERS.map((layer, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${layer.className}`}
          animate={reduced ? undefined : layer.animate}
          transition={
            reduced
              ? undefined
              : {
                  duration: layer.duration,
                  ease: "easeInOut",
                  repeat: Infinity,
                }
          }
        />
      ))}

      <motion.div
        className="absolute inset-0 opacity-[0.065]"
        animate={reduced ? undefined : { backgroundPosition: ["0px 0px", "36px 36px"] }}
        transition={reduced ? undefined : { duration: 18, ease: "linear", repeat: Infinity }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-[0.45]"
        animate={reduced ? undefined : { opacity: [0.35, 0.55, 0.38] }}
        transition={reduced ? undefined : { duration: 14, ease: "easeInOut", repeat: Infinity }}
        style={{
          background:
            "linear-gradient(120deg, rgba(244,63,94,0.10), transparent 32%, rgba(20,184,166,0.08) 64%, transparent)",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,transparent,rgba(7,8,23,0.52)_58%,rgba(7,8,23,0.92)_100%)]" />
    </div>
  );
}
