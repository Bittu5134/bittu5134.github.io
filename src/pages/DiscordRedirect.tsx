import { useEffect } from "react";

export default function DiscordRedirect() {
  useEffect(() => {
    window.location.href = "https://discord.gg/CZdNvKaNNr";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white_smoke p-4">
      <h1 className="text-3xl font-bold mb-4">Redirecting to Discord...</h1>
      <p className="text-gray-400">
        If you are not redirected automatically,{" "}
        <a
          href="https://discord.gg/CZdNvKaNNr"
          className="text-argentinian_blue underline font-semibold"
        >
          click here to join
        </a>
        .
      </p>
    </div>
  );
}
