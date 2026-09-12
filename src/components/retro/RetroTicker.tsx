export default function RetroTicker() {
  const skills = [
    "⚡ GO / GOLANG",
    "RUST",
    "C / C++",
    "PYTHON",
    "PYTORCH",
    "WEBRTC P2P",
    "LINUX DAEMONS & SOCKETS",
    "DOCKER",
    "REDIS",
    "TYPESCRIPT",
    "REACT",
    "MINECRAFT JAVA PROTOCOL",
    "SPATIAL PDF GEOMETRY",
    "CLOUDFLARE WORKERS",
    "FASTAPI",
    "eBPF NETWORKING",
  ];

  const doubledSkills = [...skills, ...skills, ...skills];

  return (
    <div className="w-full my-6 bg-[#fde047] border-y-2 border-black py-2.5 overflow-hidden select-none font-mono text-xs sm:text-sm font-bold shadow-brutal-sm relative z-20">
      <div className="flex w-max animate-ticker whitespace-nowrap">
        {doubledSkills.map((skill, index) => (
          <div key={index} className="flex items-center mx-3 sm:mx-5 text-black tracking-wider">
            <span>{skill}</span>
            <span className="ml-3 sm:ml-5 text-black/40">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
