"use client";
import React, { useState, useEffect, useRef } from "react";

const ThunderbullLanding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [energyBurst, setEnergyBurst] = useState(true);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const energyCanvasRef = useRef(null);

  // Page load animation
  // Mouse tracking for interactive effects
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

  // Real electrical energy effects
  useEffect(() => {
    if (!energyBurst) return;

    const canvas = energyCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const realLightning = [];
    const electricArcs = [];
    const plasmaBalls = [];
    const staticDischarge = [];

    // Real lightning physics
    class RealLightning {
      constructor() {
        this.startX = Math.random() * canvas.width;
        this.startY = -50;
        this.currentX = this.startX;
        this.currentY = this.startY;
        this.targetX = canvas.width / 2 + (Math.random() - 0.5) * 200;
        this.targetY = canvas.height / 2;
        this.branches = [];
        this.mainPath = [{ x: this.currentX, y: this.currentY }];
        this.voltage = 1000 + Math.random() * 5000;
        this.life = 0;
        this.maxLife = 8 + Math.random() * 4;
        this.isActive = true;
      }

      step() {
        if (!this.isActive) return;

        const dx = this.targetX - this.currentX;
        const dy = this.targetY - this.currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) {
          this.isActive = false;
          return;
        }

        // Real stepped leader behavior
        const stepSize = 15 + Math.random() * 25;
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.8;

        this.currentX += Math.cos(angle) * stepSize;
        this.currentY += Math.sin(angle) * stepSize;

        this.mainPath.push({ x: this.currentX, y: this.currentY });

        // Create branches (real lightning branching)
        if (Math.random() < 0.3 && this.mainPath.length > 3) {
          const branchStart = this.mainPath[this.mainPath.length - 2];
          const branchAngle = angle + (Math.random() - 0.5) * 1.5;
          const branchLength = 30 + Math.random() * 60;

          this.branches.push({
            start: { ...branchStart },
            end: {
              x: branchStart.x + Math.cos(branchAngle) * branchLength,
              y: branchStart.y + Math.sin(branchAngle) * branchLength,
            },
            intensity: Math.random(),
          });
        }
      }

      update() {
        this.life++;
        if (this.life < this.maxLife) {
          this.step();
        } else {
          // Reset for new strike
          this.startX = Math.random() * canvas.width;
          this.startY = -50;
          this.currentX = this.startX;
          this.currentY = this.startY;
          this.targetX = canvas.width / 2 + (Math.random() - 0.5) * 200;
          this.targetY = canvas.height / 2;
          this.mainPath = [{ x: this.currentX, y: this.currentY }];
          this.branches = [];
          this.life = 0;
          this.isActive = true;
          this.voltage = 1000 + Math.random() * 5000;
        }
      }

      draw(ctx) {
        if (this.mainPath.length < 2) return;

        const alpha = this.isActive
          ? 0.9
          : Math.max(0, 1 - (this.life - this.maxLife) / 5);

        // Draw main channel with realistic electrical glow
        ctx.save();

        // Outer glow (corona discharge)
        ctx.shadowColor = "#00BFFF";
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.moveTo(this.mainPath[0].x, this.mainPath[0].y);
        for (let i = 1; i < this.mainPath.length; i++) {
          ctx.lineTo(this.mainPath[i].x, this.mainPath[i].y);
        }
        ctx.strokeStyle = `rgba(0, 191, 255, ${alpha * 0.3})`;
        ctx.lineWidth = 8;
        ctx.stroke();

        // Middle channel (plasma)
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#FFFFFF";
        ctx.beginPath();
        ctx.moveTo(this.mainPath[0].x, this.mainPath[0].y);
        for (let i = 1; i < this.mainPath.length; i++) {
          ctx.lineTo(this.mainPath[i].x, this.mainPath[i].y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Core channel (pure energy)
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.moveTo(this.mainPath[0].x, this.mainPath[0].y);
        for (let i = 1; i < this.mainPath.length; i++) {
          ctx.lineTo(this.mainPath[i].x, this.mainPath[i].y);
        }
        ctx.strokeStyle = `rgba(200, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw branches
        this.branches.forEach((branch) => {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#00BFFF";
          ctx.beginPath();
          ctx.moveTo(branch.start.x, branch.start.y);
          ctx.lineTo(branch.end.x, branch.end.y);
          ctx.strokeStyle = `rgba(0, 191, 255, ${
            alpha * branch.intensity * 0.6
          })`;
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        ctx.restore();
      }
    }

    // Plasma ball energy
    class PlasmaBall {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -30;
        this.targetX = canvas.width / 2 + (Math.random() - 0.5) * 300;
        this.targetY = canvas.height / 2 + (Math.random() - 0.5) * 200;
        this.vx = 0;
        this.vy = 0;
        this.size = 5 + Math.random() * 15;
        this.energy = Math.random();
        this.electricArcs = [];
        this.life = 0;
        this.maxLife = 100 + Math.random() * 50;
      }

      update() {
        this.life++;

        // Move towards target with electromagnetic behavior
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const force = 0.02;

        this.vx += dx * force;
        this.vy += dy * force;

        // Add electromagnetic fluctuations
        this.vx += (Math.random() - 0.5) * 0.5;
        this.vy += (Math.random() - 0.5) * 0.5;

        // Damping
        this.vx *= 0.98;
        this.vy *= 0.98;

        this.x += this.vx;
        this.y += this.vy;

        // Generate electric arcs
        if (Math.random() < 0.1) {
          this.electricArcs.push({
            angle: Math.random() * Math.PI * 2,
            length: 10 + Math.random() * 20,
            intensity: Math.random(),
            life: 5 + Math.random() * 10,
          });
        }

        // Update arcs
        this.electricArcs = this.electricArcs.filter((arc) => {
          arc.life--;
          return arc.life > 0;
        });

        if (this.life > this.maxLife) {
          this.reset();
        }
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -30;
        this.targetX = canvas.width / 2 + (Math.random() - 0.5) * 300;
        this.targetY = canvas.height / 2 + (Math.random() - 0.5) * 200;
        this.vx = 0;
        this.vy = 0;
        this.life = 0;
        this.electricArcs = [];
      }

      draw(ctx) {
        const alpha = Math.max(0, 1 - this.life / this.maxLife);

        ctx.save();

        // Draw electric arcs around plasma ball
        this.electricArcs.forEach((arc) => {
          const arcAlpha = (arc.life / 10) * alpha * arc.intensity;
          const endX = this.x + Math.cos(arc.angle) * arc.length;
          const endY = this.y + Math.sin(arc.angle) * arc.length;

          ctx.shadowColor = "#00FFFF";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = `rgba(0, 255, 255, ${arcAlpha})`;
          ctx.lineWidth = 1 + Math.random();
          ctx.stroke();
        });

        // Draw plasma core
        ctx.shadowColor = "#FFFFFF";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 255, 255, ${alpha * 0.8})`;
        ctx.fill();

        // Inner core
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        ctx.restore();
      }
    }

    // Static discharge effects
    class StaticDischarge {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.sparks = [];
        this.life = 0;
        this.maxLife = 20 + Math.random() * 30;

        // Generate sparks
        for (let i = 0; i < 8 + Math.random() * 12; i++) {
          this.sparks.push({
            x: this.x,
            y: this.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 15 + Math.random() * 15,
            maxLife: 15 + Math.random() * 15,
          });
        }
      }

      update() {
        this.life++;

        this.sparks.forEach((spark) => {
          spark.life--;
          spark.x += spark.vx;
          spark.y += spark.vy;
          spark.vx *= 0.95;
          spark.vy *= 0.95;
        });

        this.sparks = this.sparks.filter((spark) => spark.life > 0);

        if (this.life > this.maxLife) {
          this.reset();
        }
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.life = 0;
        this.sparks = [];

        for (let i = 0; i < 8 + Math.random() * 12; i++) {
          this.sparks.push({
            x: this.x,
            y: this.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 15 + Math.random() * 15,
            maxLife: 15 + Math.random() * 15,
          });
        }
      }

      draw(ctx) {
        ctx.save();

        this.sparks.forEach((spark) => {
          const alpha = spark.life / spark.maxLife;

          ctx.shadowColor = "#FFFF00";
          ctx.shadowBlur = 5;
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, 1 + Math.random(), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
          ctx.fill();
        });

        ctx.restore();
      }
    }

    // Initialize real energy effects
    for (let i = 0; i < 6; i++) {
      realLightning.push(new RealLightning());
    }

    for (let i = 0; i < 25; i++) {
      plasmaBalls.push(new PlasmaBall());
    }

    for (let i = 0; i < 15; i++) {
      staticDischarge.push(new StaticDischarge());
    }

    const animateRealEnergy = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Electromagnetic field distortion
      const time = Date.now() * 0.001;
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      realLightning.forEach((bolt) => {
        bolt.update();
        bolt.draw(ctx);
      });

      plasmaBalls.forEach((ball) => {
        ball.update();
        ball.draw(ctx);
      });

      staticDischarge.forEach((discharge) => {
        discharge.update();
        discharge.draw(ctx);
      });

      ctx.restore();

      if (energyBurst) {
        requestAnimationFrame(animateRealEnergy);
      }
    };

    animateRealEnergy();
  }, [energyBurst]);
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Lightning animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lightningBolts = [];

    class LightningBolt {
      constructor() {
        this.reset();
        this.opacity = Math.random() * 0.5 + 0.3;
        this.thickness = Math.random() * 2 + 1;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.endX = this.x + (Math.random() - 0.5) * 200;
        this.endY = this.y + Math.random() * 150 + 50;
        this.segments = this.generateSegments();
        this.life = 0;
        this.maxLife = Math.random() * 20 + 10;
      }

      generateSegments() {
        const segments = [];
        const numSegments = 8 + Math.floor(Math.random() * 8);

        for (let i = 0; i <= numSegments; i++) {
          const progress = i / numSegments;
          const x =
            this.x +
            (this.endX - this.x) * progress +
            (Math.random() - 0.5) * 30;
          const y =
            this.y +
            (this.endY - this.y) * progress +
            (Math.random() - 0.5) * 20;
          segments.push({ x, y });
        }
        return segments;
      }

      update() {
        this.life++;
        if (this.life > this.maxLife) {
          this.reset();
        }
      }

      draw(ctx) {
        if (this.segments.length < 2) return;

        const alpha =
          Math.sin((this.life / this.maxLife) * Math.PI) * this.opacity;

        // Main bolt
        ctx.beginPath();
        ctx.moveTo(this.segments[0].x, this.segments[0].y);

        for (let i = 1; i < this.segments.length; i++) {
          ctx.lineTo(this.segments[i].x, this.segments[i].y);
        }

        ctx.strokeStyle = `rgba(255, 200, 0, ${alpha})`;
        ctx.lineWidth = this.thickness;
        ctx.stroke();

        // Glow effect
        ctx.shadowColor = "#ffaa00";
        ctx.shadowBlur = 10;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.lineWidth = this.thickness * 0.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Initialize lightning bolts
    for (let i = 0; i < 6; i++) {
      lightningBolts.push(new LightningBolt());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lightningBolts.forEach((bolt) => {
        bolt.update();
        bolt.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Energy Burst Canvas - Only during load */}
      {energyBurst && (
        <canvas
          ref={energyCanvasRef}
          className="absolute inset-0 z-50 pointer-events-none"
        />
      )}

      {/* Background Canvas for Lightning */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Background Gradient */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `
            radial-gradient(circle at 30% 40%, rgba(255, 140, 0, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(255, 200, 0, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(0, 0, 0, 1) 100%)
          `,
        }}
      />

      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-400 opacity-20 animate-pulse"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav
        className={`absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-6 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className="text-white text-xl">⚡</div>
          <span className="text-white text-sm">Menu</span>
        </div>

        <h1 className="text-white text-2xl font-bold tracking-wider">
          Thunderbull
        </h1>

        <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition-colors">
          ORDER
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-between h-full px-12">
        {/* Left Content */}
        <div
          className={`flex-1 max-w-lg transition-all duration-1500 delay-500 ${
            isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
          }`}
        >
          <h2
            className="text-6xl font-bold text-white mb-6 leading-tight"
            style={{
              transform: `translateX(${mousePosition.x * 10}px) translateY(${
                mousePosition.y * 5
              }px)`,
            }}
          >
            Feel the
            <br />
            <span className="text-yellow-400 text-7xl">Thunder</span>
          </h2>

          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Welcome to a world where mythical power
            <br />
            meets unmatched energy.
          </p>

          <button className="bg-transparent border-2 border-yellow-400 text-yellow-400 px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-105">
            ORDER
          </button>
        </div>

        {/* Center Can */}
        <div className="flex-1 flex justify-center items-center relative">
          <div
            className={`relative transform transition-all duration-2000 delay-1000 ${
              isLoaded
                ? "translate-y-0 opacity-100 scale-100"
                : "-translate-y-full opacity-0 scale-50"
            }`}
            style={{
              transform: `
                ${isLoaded ? "translateY(0)" : "translateY(-100vh)"} 
                perspective(1000px) 
                rotateY(${mousePosition.x * 5}deg) 
                rotateX(${-mousePosition.y * 5}deg)
                translateX(${mousePosition.x * 20}px)
                scale(${isLoaded ? 1 : 0.5})
              `,
            }}
          >
            {/* Main Can */}
            <div className="relative w-64 h-96 mx-auto">
              {/* Can Body */}
              <div
                className="w-full h-full relative overflow-hidden"
                style={{
                  background: `
                    linear-gradient(160deg, 
                      #D4A574 0%,
                      #F4D03F 15%,
                      #F39C12 25%,
                      #E67E22 40%,
                      #D68910 55%,
                      #F7DC6F 70%,
                      #F1C40F 85%,
                      #D4A574 100%
                    )
                  `,
                  borderRadius: "20px 20px 25px 25px",
                  boxShadow: `
                    0 0 60px rgba(244, 208, 63, 0.6),
                    inset -5px 0 20px rgba(0, 0, 0, 0.2),
                    inset 5px 0 20px rgba(255, 255, 255, 0.1),
                    0 25px 50px rgba(0, 0, 0, 0.7)
                  `,
                }}
              >
                {/* Can Top Rim */}
                <div
                  className="absolute top-0 left-2 right-2 h-6 rounded-t-lg"
                  style={{
                    background:
                      "linear-gradient(90deg, #BDC3C7 0%, #ECF0F1 50%, #BDC3C7 100%)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                />

                {/* Brand Text Area */}
                <div className="absolute top-8 left-4 right-4 h-20 flex flex-col items-center justify-center">
                  <div className="text-black font-bold text-xl tracking-wider opacity-80">
                    THUNDERBULL
                  </div>
                  <div className="text-black text-xs font-semibold opacity-60 mt-1">
                    ENERGY DRINK
                  </div>
                </div>

                {/* Large Lightning Bolt Design */}
                <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
                  <div
                    className="w-20 h-40 opacity-70"
                    style={{
                      background: `
                        linear-gradient(45deg, 
                          rgba(0, 0, 0, 0.3) 0%,
                          rgba(0, 0, 0, 0.1) 50%,
                          rgba(0, 0, 0, 0.3) 100%
                        )
                      `,
                      clipPath:
                        "polygon(30% 0%, 70% 0%, 40% 40%, 80% 40%, 45% 100%, 20% 60%, 50% 60%)",
                      filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
                    }}
                  />
                </div>

                {/* Side Lightning Patterns */}
                <div className="absolute top-20 left-2 w-8 h-24">
                  <div
                    className="w-full h-full opacity-50"
                    style={{
                      background: "rgba(0, 0, 0, 0.2)",
                      clipPath:
                        "polygon(20% 0%, 80% 30%, 30% 60%, 70% 100%, 10% 70%, 60% 40%)",
                    }}
                  />
                </div>

                <div className="absolute top-20 right-2 w-8 h-24">
                  <div
                    className="w-full h-full opacity-50"
                    style={{
                      background: "rgba(0, 0, 0, 0.2)",
                      clipPath:
                        "polygon(80% 0%, 20% 30%, 70% 60%, 30% 100%, 90% 70%, 40% 40%)",
                    }}
                  />
                </div>

                {/* Metallic Shine Effect */}
                <div
                  className="absolute left-6 top-12 w-6 h-60 opacity-40 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.1) 70%, rgba(255,255,255,0.4) 100%)",
                    transform: "skew(-5deg)",
                    filter: "blur(1px)",
                  }}
                />

                {/* Bottom Text Area */}
                <div className="absolute bottom-8 left-4 right-4 h-12 flex flex-col items-center justify-center">
                  <div className="text-black text-xs font-bold opacity-60">
                    250ML
                  </div>
                  <div className="text-black text-xs opacity-50 mt-1">
                    PREMIUM ENERGY
                  </div>
                </div>

                {/* Embossed Ring Details */}
                <div className="absolute top-28 left-2 right-2 h-1 bg-black opacity-20 rounded-full"></div>
                <div className="absolute bottom-20 left-2 right-2 h-1 bg-black opacity-20 rounded-full"></div>
              </div>

              {/* Glow Effect */}
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
                        rgba(244, 208, 63, ${isLoaded ? "0.4" : "0.8"}) 0%, 
                        rgba(243, 156, 18, 0.2) 40%,
                        transparent 70%
                      )
                    `,
                    borderRadius: "20px 20px 25px 25px",
                    filter: "blur(3px)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Info */}
        <div
          className={`flex-1 flex flex-col items-end space-y-8 transition-all duration-1500 delay-700 ${
            isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
          }`}
        >
          {/* Price Tag */}
          <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold flex items-center space-x-2">
            <span>💰</span>
            <span>5.2kr</span>
          </div>

          {/* Product Thumbnail */}
          <div className="w-24 h-32 rounded-lg overflow-hidden border-2 border-yellow-400">
            <div
              className="w-full h-full"
              style={{
                background: `
                  linear-gradient(160deg, 
                    #D4A574 0%,
                    #F4D03F 25%,
                    #F39C12 50%,
                    #E67E22 75%,
                    #D4A574 100%
                  )
                `,
              }}
            />
          </div>

          {/* Navigation Dots */}
          <div className="flex flex-col space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? "bg-yellow-400" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div
        className={`absolute top-1/3 left-1/4 w-2 h-2 bg-yellow-400 rounded-full transition-all duration-2000 delay-1500 ${
          isLoaded ? "animate-bounce opacity-60" : "opacity-0"
        }`}
        style={{ animationDelay: "1s" }}
      />
      <div
        className={`absolute top-2/3 right-1/3 w-1 h-1 bg-white rounded-full transition-all duration-2000 delay-1700 ${
          isLoaded ? "animate-ping opacity-40" : "opacity-0"
        }`}
        style={{ animationDelay: "2s" }}
      />
      <div
        className={`absolute top-1/2 left-3/4 w-3 h-3 bg-yellow-300 rounded-full transition-all duration-2000 delay-1900 ${
          isLoaded ? "animate-pulse opacity-50" : "opacity-0"
        }`}
        style={{ animationDelay: "0.5s" }}
      />

      {/* Screen Flash Effect for Energy Burst */}
      {energyBurst && (
        <div className="absolute inset-0 z-40 bg-yellow-400 opacity-20 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

export default ThunderbullLanding;
