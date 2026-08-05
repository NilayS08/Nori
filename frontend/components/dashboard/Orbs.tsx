export function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          animation: "float-orb 18s ease-in-out infinite",
          borderRadius: "50%",
          filter: "blur(1px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "-15%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          animation: "float-orb 24s ease-in-out infinite reverse",
          borderRadius: "50%",
          filter: "blur(1px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "30%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)",
          animation: "float-orb 20s ease-in-out infinite 8s",
          borderRadius: "50%",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
}
