import React from 'react';

export const GalaxyBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient similar to Jubbler */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0033] via-[#2d1b4e] to-[#0a0015]"></div>
      
      {/* Purple glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full filter blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-fuchsia-500/15 rounded-full filter blur-[90px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Larger glowing stars */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full filter blur-[1px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.3,
              animation: `twinkle ${3 + Math.random() * 4}s infinite`,
              animationDelay: `${Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
