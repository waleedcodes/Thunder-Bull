"use client";
import React, { useState, useEffect, useRef } from "react";

const ThunderbullLanding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [energyBurst, setEnergyBurst] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const energyCanvasRef = useRef(null);
  const gifBackgroundRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    const energyTimer = setTimeout(() => {
      setEnergyBurst(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(energyTimer);
    };
  }, []);

  // Animated GIF-like Background Effect
  useEffect(() => {
    const canvas = gifBackgroundRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const pulseRings = [];
    const energyWaves = [];
    const floatingOrbs = [];

    // Adjusted for mobile performance
    const particleCount = isMobile
      ? { rings: 4, waves: 6, orbs: 12 }
      : { rings: 8, waves: 12, orbs: 25 };

    // Animated Pulse Rings (GIF-like effect)
    class PulseRing {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 0;
        this.maxRadius = 50 + Math.random() * 100;
        this.speed = 0.5 + Math.random() * 1;
        this.opacity = 1;
        this.color = Math.random() > 0.5 ? "#FFD700" : "#FFA500";
        this.life = 0;
        this.maxLife = 120;
      }

      update() {
        this.life++;
        this.radius += this.speed;
        this.opacity = Math.max(0, 1 - this.radius / this.maxRadius);

        if (this.life > this.maxLife) {
          this.reset();
        }
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 0;
        this.maxRadius = 50 + Math.random() * 100;
        this.speed = 0.5 + Math.random() * 1;
        this.opacity = 1;
        this.color = Math.random() > 0.5 ? "#FFD700" : "#FFA500";
        this.life = 0;
      }

      draw(ctx) {
        if (this.radius <= 0) return;

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        // Outer ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${this.color}${Math.floor(this.opacity * 0.3 * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `${this.color}${Math.floor(this.opacity * 0.6 * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }
    }

    // Energy Waves (Animated like GIF)
    class EnergyWave {
      constructor() {
        this.x = -50;
        this.y = Math.random() * canvas.height;
        this.width = 0;
        this.height = 2 + Math.random() * 6;
        this.speed = 2 + Math.random() * 4;
        this.opacity = 0.8;
        this.frequency = Math.random() * 0.02 + 0.01;
        this.amplitude = 10 + Math.random() * 20;
        this.time = 0;
      }

      update() {
        this.x += this.speed;
        this.time += 0.1;
        this.width = Math.min(200 + Math.random() * 100, canvas.width - this.x);

        if (this.x > canvas.width + 50) {
          this.reset();
        }
      }

      reset() {
        this.x = -50;
        this.y = Math.random() * canvas.height;
        this.width = 0;
        this.speed = 2 + Math.random() * 4;
        this.time = 0;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const gradient = ctx.createLinearGradient(
          this.x,
          0,
          this.x + this.width,
          0
        );
        gradient.addColorStop(0, "rgba(255, 215, 0, 0)");
        gradient.addColorStop(0.5, `rgba(255, 165, 0, ${this.opacity})`);
        gradient.addColorStop(1, "rgba(255, 215, 0, 0)");

        ctx.fillStyle = gradient;

        // Create wavy effect
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        for (let i = 0; i <= this.width; i += 5) {
          const waveY =
            this.y + Math.sin(i * this.frequency + this.time) * this.amplitude;
          ctx.lineTo(this.x + i, waveY);
        }

        ctx.lineTo(this.x + this.width, this.y + this.height);

        for (let i = this.width; i >= 0; i -= 5) {
          const waveY =
            this.y +
            this.height +
            Math.sin(i * this.frequency + this.time) * this.amplitude;
          ctx.lineTo(this.x + i, waveY);
        }

        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // Floating Energy Orbs
    class FloatingOrb {
      constructor() {
        this.reset();
        this.baseSize = 3 + Math.random() * 8;
        this.pulseSpeed = 0.05 + Math.random() * 0.05;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -1 - Math.random() * 2;
        this.life = 0;
        this.maxLife = 200 + Math.random() * 100;
        this.color = Math.random() > 0.7 ? "#FFFF00" : "#FFA500";
      }

      update() {
        this.life++;
        this.x += this.vx;
        this.y += this.vy;

        // Add some drift
        this.vx += (Math.random() - 0.5) * 0.1;
        this.vy += (Math.random() - 0.5) * 0.05;

        // Boundaries
        if (
          this.x < 0 ||
          this.x > canvas.width ||
          this.y < -50 ||
          this.life > this.maxLife
        ) {
          this.reset();
        }
      }

      draw(ctx) {
        const time = Date.now() * 0.001;
        const pulseSize =
          this.baseSize +
          Math.sin(time * this.pulseSpeed + this.pulseOffset) * 2;
        const opacity = Math.max(0, 1 - this.life / this.maxLife);

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        // Outer glow
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          pulseSize * 2
        );
        gradient.addColorStop(
          0,
          `${this.color}${Math.floor(opacity * 0.8 * 255)
            .toString(16)
            .padStart(2, "0")}`
        );
        gradient.addColorStop(
          0.5,
          `${this.color}${Math.floor(opacity * 0.4 * 255)
            .toString(16)
            .padStart(2, "0")}`
        );
        gradient.addColorStop(1, `${this.color}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `${this.color}${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // Initialize animated elements
    for (let i = 0; i < particleCount.rings; i++) {
      pulseRings.push(new PulseRing());
    }

    for (let i = 0; i < particleCount.waves; i++) {
      energyWaves.push(new EnergyWave());
    }

    for (let i = 0; i < particleCount.orbs; i++) {
      floatingOrbs.push(new FloatingOrb());
    }

    const animateGifBackground = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient that pulses
      const time = Date.now() * 0.001;
      const pulseIntensity = 0.3 + Math.sin(time * 2) * 0.1;

      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );
      bgGradient.addColorStop(0, `rgba(40, 20, 0, ${pulseIntensity})`);
      bgGradient.addColorStop(0.5, `rgba(20, 10, 0, ${pulseIntensity * 0.7})`);
      bgGradient.addColorStop(1, `rgba(10, 5, 0, ${pulseIntensity * 0.5})`);

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw all animated elements
      pulseRings.forEach((ring) => {
        ring.update();
        ring.draw(ctx);
      });

      energyWaves.forEach((wave) => {
        wave.update();
        wave.draw(ctx);
      });

      floatingOrbs.forEach((orb) => {
        orb.update();
        orb.draw(ctx);
      });

      requestAnimationFrame(animateGifBackground);
    };

    animateGifBackground();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [isMobile]);

  // Mouse tracking (disabled on mobile for performance)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* GIF-like Animated Background */}
      <canvas ref={gifBackgroundRef} className="absolute inset-0 z-0" />

      {/* Enhanced Background Gradient with Animation */}
      <div
        className="absolute inset-0 opacity-60 animate-pulse"
        style={{
          background: `
            radial-gradient(circle at 30% 40%, rgba(255, 140, 0, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(255, 200, 0, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(255, 165, 0, 0.2) 0%, transparent 40%),
            linear-gradient(135deg, rgba(40, 20, 10, 0.9) 0%, rgba(0, 0, 0, 1) 100%)
          `,
          animationDuration: "4s",
        }}
      />

      {/* Animated Background Particles - Responsive */}
      <div className="absolute inset-0 z-5">
        {[...Array(isMobile ? 15 : 30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-400 opacity-30"
            style={{
              width: `${Math.random() * (isMobile ? 4 : 6) + 2}px`,
              height: `${Math.random() * (isMobile ? 4 : 6) + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `
                float ${Math.random() * 4 + 2}s ease-in-out infinite,
                pulse ${Math.random() * 3 + 1}s ease-in-out infinite alternate,
                drift ${Math.random() * 8 + 5}s linear infinite
              `,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Modern Navigation */}
      <nav
        className={`absolute top-0 left-0 right-0 z-50 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <div className="flex justify-between items-center p-4 md:p-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl animate-pulse">
              <div className="text-white text-lg md:text-xl">⚡</div>
            </div>
            <div className="hidden md:block">
              <span className="text-white text-sm font-medium">Menu</span>
            </div>
          </div>

          {/* Brand */}
          <h1 className="text-white text-xl md:text-2xl font-bold tracking-wider bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Thunderbull
          </h1>

          {/* CTA Button */}
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 md:px-6 md:py-2 rounded-full font-semibold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/50 text-sm md:text-base">
            ORDER NOW
          </button>
        </div>
      </nav>

      {/* Main Content - Responsive Layout */}
      <div className="relative z-20 min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 md:px-8 lg:px-12 pt-20 lg:pt-0">
        {/* Left Content */}
        <div
          className={`w-full lg:flex-1 max-w-2xl lg:max-w-lg text-center lg:text-left mb-8 lg:mb-0 transition-all duration-1500 delay-500 ${
            isLoaded
              ? "opacity-100 translate-y-0 lg:translate-x-0"
              : "opacity-0 translate-y-10 lg:-translate-x-20"
          }`}
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            style={{
              transform: isMobile
                ? "none"
                : `translateX(${mousePosition.x * 10}px) translateY(${
                    mousePosition.y * 5
                  }px)`,
              textShadow:
                "0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 165, 0, 0.3)",
            }}
          >
            Feel the
            <br />
            <span className="text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-5xl md:text-6xl lg:text-7xl animate-pulse">
              Thunder
            </span>
          </h2>

          <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
            Welcome to a world where mythical power meets unmatched energy.
            Experience the ultimate boost.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="bg-transparent border-2 border-yellow-400 text-yellow-400 px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/50">
              ORDER NOW
            </button>
            <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>

        {/* Center Can - Responsive */}
        <div className="w-full lg:flex-1 flex justify-center items-center relative mb-8 lg:mb-0">
          <div
            className={`relative transform transition-all duration-2000 delay-1000 ${
              isLoaded
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-10 lg:-translate-y-full opacity-0 scale-75 lg:scale-50"
            }`}
            style={{
              transform: isMobile
                ? `${isLoaded ? "translateY(0)" : "translateY(20px)"} scale(${
                    isLoaded ? 1 : 0.75
                  })`
                : `
                  ${isLoaded ? "translateY(0)" : "translateY(-100vh)"} 
                  perspective(1000px) 
                  rotateY(${mousePosition.x * 5}deg) 
                  rotateX(${-mousePosition.y * 5}deg)
                  translateX(${mousePosition.x * 20}px)
                  scale(${isLoaded ? 1 : 0.5})
                `,
            }}
          >
            {/* Can Container */}
            <div className="relative w-48 h-72 md:w-56 md:h-80 lg:w-64 lg:h-96 mx-auto">
              {/* Can Body */}
              <img
                src="frame_1.png"
                alt="Thunderbull"
                className="absolute top-0 left-0 w-full h-full"
                width={1500}
                style={{
                  filter: isLoaded ? "none" : "blur(10px)",
                  transition: "filter 0.5s ease-in-out",
                }}
              />

              {/* Enhanced Glow Effect */}
              <div
                className={`absolute inset-0 rounded-lg transition-all duration-1000 ${
                  isLoaded ? "animate-pulse" : ""
                }`}
              >
                <div
                  className="w-full h-full"
                  style={{
                    background: `
                      radial-gradient(ellipse at center, 
                        rgba(244, 208, 63, ${isLoaded ? "0.6" : "1.0"}) 0%, 
                        rgba(243, 156, 18, 0.4) 40%,
                        rgba(255, 165, 0, 0.2) 60%,
                        transparent 80%
                      )
                    `,
                    borderRadius: "20px 20px 25px 25px",
                    filter: "blur(5px)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Info - Modern Cards */}
        <div
          className={`w-full lg:flex-1 flex flex-row lg:flex-col items-center lg:items-end justify-center space-x-4 lg:space-x-0 lg:space-y-6 transition-all duration-1500 delay-700 ${
            isLoaded
              ? "opacity-100 translate-y-0 lg:translate-x-0"
              : "opacity-0 translate-y-10 lg:translate-x-20"
          }`}
        >
          {/* Price Card - Modern Design */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-3 rounded-2xl font-bold flex items-center space-x-2 animate-bounce hover:scale-105 transition-transform duration-300 shadow-lg shadow-yellow-400/50 backdrop-blur-sm">
            <span className="text-lg">💰</span>
            <div className="flex flex-col">
              <span className="text-xs opacity-80">From</span>
              <span className="text-sm md:text-base">5.2kr</span>
            </div>
          </div>

          {/* Product Info Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 transform hover:shadow-lg hover:shadow-yellow-400/30">
            <div className="w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border border-yellow-400/50 mb-3">
              <img
                src="frame_1.png"
                alt="Thunderbull"
                className="absolute top-0 left-0 w-full h-full"
                width={1500}
                style={{
                  filter: isLoaded ? "none" : "blur(10px)",
                  transition: "filter 0.5s ease-in-out",
                }}
              />
            </div>
            <div className="text-white text-xs font-medium">Original</div>
          </div>

          {/* Navigation Dots - Modern */}
          <div className="hidden lg:flex flex-col space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === 0
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse scale-125 shadow-lg shadow-yellow-400/50"
                    : "bg-white/30 hover:bg-white/50 hover:scale-110"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modern Feature Cards - Mobile/Tablet */}
      <div
        className={`lg:hidden relative z-20 px-4 pb-8 transition-all duration-1500 delay-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {/* Energy Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-white text-sm font-medium mb-1">
              High Energy
            </div>
            <div className="text-gray-400 text-xs">Instant boost</div>
          </div>

          {/* Taste Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl mb-2">🔥</div>
            <div className="text-white text-sm font-medium mb-1">
              Great Taste
            </div>
            <div className="text-gray-400 text-xs">Premium flavor</div>
          </div>

          {/* Natural Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl mb-2">🌿</div>
            <div className="text-white text-sm font-medium mb-1">Natural</div>
            <div className="text-gray-400 text-xs">No artificial</div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements - Responsive */}
      <div
        className={`absolute top-1/4 left-1/4 w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full transition-all duration-2000 delay-1500 ${
          isLoaded ? "animate-bounce opacity-80" : "opacity-0"
        }`}
        style={{
          animationDelay: "1s",
          boxShadow: "0 0 10px rgba(255, 215, 0, 0.8)",
        }}
      />
      <div
        className={`absolute top-2/3 right-1/3 w-1 h-1 md:w-2 md:h-2 bg-white rounded-full transition-all duration-2000 delay-1700 ${
          isLoaded ? "animate-ping opacity-60" : "opacity-0"
        }`}
        style={{
          animationDelay: "2s",
          boxShadow: "0 0 8px rgba(255, 255, 255, 0.6)",
        }}
      />
      <div
        className={`absolute top-1/2 left-3/4 w-2 h-2 md:w-4 md:h-4 bg-yellow-300 rounded-full transition-all duration-2000 delay-1900 ${
          isLoaded ? "animate-pulse opacity-70" : "opacity-0"
        }`}
        style={{
          animationDelay: "0.5s",
          boxShadow: "0 0 12px rgba(255, 255, 0, 0.7)",
        }}
      />

      {/* Screen Flash Effect for Energy Burst - Enhanced */}
      {energyBurst && (
        <div
          className="absolute inset-0 z-40 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 opacity-30 animate-pulse pointer-events-none"
          style={{ animationDuration: "0.5s" }}
        />
      )}

      {/* Bottom CTA Section - Mobile */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-t border-white/10 p-4 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        }`}
      >
        <div className="flex space-x-3 max-w-sm mx-auto">
          <button className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 rounded-full font-semibold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform active:scale-95">
            Order Now
          </button>
          <button className="px-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 transform active:scale-95">
            Info
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes drift {
          0% {
            transform: translateX(0px);
          }
          100% {
            transform: translateX(100px);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #fbbf24, #f59e0b);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #f59e0b, #d97706);
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Hide scrollbar for mobile */
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            display: none;
          }

          body {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }

        /* Improved touch targets for mobile */
        @media (max-width: 768px) {
          button {
            min-height: 44px;
            min-width: 44px;
          }
        }

        /* Enhanced backdrop blur support */
        @supports (backdrop-filter: blur(20px)) {
          .backdrop-blur-md {
            backdrop-filter: blur(20px);
          }

          .backdrop-blur-lg {
            backdrop-filter: blur(24px);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .bg-white\/10 {
            background-color: rgba(255, 255, 255, 0.2);
          }

          .border-white\/20 {
            border-color: rgba(255, 255, 255, 0.4);
          }
        }

        /* Dark mode preferences */
        @media (prefers-color-scheme: dark) {
          .bg-black {
            background-color: #000000;
          }
        }

        /* Focus styles for accessibility */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid #fbbf24;
          outline-offset: 2px;
        }

        /* Loading skeleton animation */
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .loading-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default ThunderbullLanding;
