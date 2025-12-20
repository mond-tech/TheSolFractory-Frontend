"use client";

export default function BurningCigarette() {
  return (
    <div className="relative not-md:mt-1 h-12 md:h-16 rotate-330 flex items-center justify-center ml-0">
      <div className="relative group">
        <svg
          width="56"
          height="48"
          viewBox="0 0 56 48"
          className="drop-shadow-[0_4px_12px_rgba(77,166,255,0.3)] hover:drop-shadow-[0_6px_16px_rgba(77,166,255,0.5)] hover:scale-110 transition-all duration-300"
        >
          <defs>
            {/* Cigarette body gradient */}
            <linearGradient id="cigBodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F5F5F5" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E8E8E8" />
            </linearGradient>
            
            {/* Filter gradient */}
            <linearGradient id="filterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4A574" />
              <stop offset="50%" stopColor="#C8966A" />
              <stop offset="100%" stopColor="#B8875F" />
            </linearGradient>
            
            {/* Ember radial gradient */}
            <radialGradient id="emberRadial" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#FF4500" stopOpacity="1" />
              <stop offset="30%" stopColor="#FF6347" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#FF8C00" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FFA500" stopOpacity="0.2" />
            </radialGradient>
            
            {/* Hot ember glow */}
            <radialGradient id="hotEmberGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="40%" stopColor="#FFD700" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#FF6347" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Cigarette body */}
          <rect x="8" y="20" width="40" height="8" rx="4" fill="url(#cigBodyGradient)" stroke="rgba(200,200,200,0.3)" strokeWidth="0.5" />
          
          {/* Filter tip */}
          <rect x="8" y="20" width="12" height="8" rx="4" fill="url(#filterGradient)" />
          <line x1="20" y1="20" x2="20" y2="28" stroke="rgba(139,115,85,0.4)" strokeWidth="0.5" />
          
          {/* Ash/charred area near ember */}
          <rect x="42" y="20" width="6" height="8" rx="2" fill="rgba(100,100,100,0.3)" opacity="0.6" />
          
          {/* Burning ember at tip - multiple layers for realistic effect */}
          <g className="burning-ember-group">
            {/* Outer intense glow */}
            <circle cx="48" cy="24" r="6" fill="rgba(255,69,0,0.3)" className="ember-outer-glow" />
            
            {/* Large ember glow */}
            <circle cx="48" cy="24" r="5" fill="url(#emberRadial)" className="ember-glow-pulse" />
            
            {/* Middle burning ember */}
            <circle cx="48" cy="24" r="3.5" fill="rgba(255,140,0,0.95)" className="ember-flicker" />
            
            {/* Hot orange center */}
            <circle cx="48" cy="24" r="2.5" fill="rgba(255,100,50,1)" className="ember-hot" />
            
            {/* Bright yellow hot spot */}
            <circle cx="48" cy="24" r="1.8" fill="rgba(255,215,0,1)" className="ember-bright" />
            
            {/* White hot center */}
            <circle cx="48" cy="24" r="1.2" fill="rgba(255,255,255,0.95)" className="ember-white-hot" />
            
            {/* Tiny white core */}
            <circle cx="48" cy="24" r="0.6" fill="rgba(255,255,255,1)" className="ember-core" />
          </g>
          
          {/* Smoke particles rising from tip */}
          <g className="smoke-container">
            {/* Close smoke particles */}
            <circle cx="48" cy="18" r="1.5" fill="rgba(200,200,200,0.7)" className="smoke-particle smoke-1" />
            <circle cx="46" cy="14" r="1.2" fill="rgba(220,220,220,0.6)" className="smoke-particle smoke-2" />
            <circle cx="50" cy="12" r="1" fill="rgba(240,240,240,0.5)" className="smoke-particle smoke-3" />
            
            {/* Medium smoke clouds */}
            <ellipse cx="48" cy="6" rx="2.5" ry="2" fill="rgba(200,200,200,0.5)" className="smoke-cloud smoke-cloud-1" />
            <ellipse cx="46" cy="2" rx="2.2" ry="1.8" fill="rgba(220,220,220,0.4)" className="smoke-cloud smoke-cloud-2" />
            <ellipse cx="50" cy="0" rx="2" ry="1.5" fill="rgba(240,240,240,0.3)" className="smoke-cloud smoke-cloud-3" />
            
            {/* Distant smoke clouds */}
            <ellipse cx="48" cy="-4" rx="3" ry="2.5" fill="rgba(200,200,200,0.3)" className="smoke-cloud smoke-cloud-4" />
            <ellipse cx="45" cy="-8" rx="2.8" ry="2" fill="rgba(220,220,220,0.25)" className="smoke-cloud smoke-cloud-5" />
            <ellipse cx="51" cy="-6" rx="2.5" ry="1.8" fill="rgba(240,240,240,0.2)" className="smoke-cloud smoke-cloud-6" />
            
            {/* Farthest smoke */}
            <ellipse cx="48" cy="-12" rx="3.5" ry="3" fill="rgba(200,200,200,0.15)" className="smoke-cloud smoke-cloud-7" />
            <ellipse cx="44" cy="-16" rx="3.2" ry="2.5" fill="rgba(220,220,220,0.12)" className="smoke-cloud smoke-cloud-8" />
          </g>
        </svg>
        
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 opacity-100 transition-opacity duration-300 -z-10" />
      </div>
    </div>
  );
}

