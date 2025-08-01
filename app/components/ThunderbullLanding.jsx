"use client";
import React, { useState, useEffect, useRef } from "react";

const ThunderbullLanding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [energyBurst, setEnergyBurst] = useState(true);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const energyCanvasRef = useRef(null);
  const gifBackgroundRef = useRef(null);

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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animatedElements = [];
    const pulseRings = [];
    const energyWaves = [];
    const floatingOrbs = [];

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
    for (let i = 0; i < 8; i++) {
      pulseRings.push(new PulseRing());
    }

    for (let i = 0; i < 12; i++) {
      energyWaves.push(new EnergyWave());
    }

    for (let i = 0; i < 25; i++) {
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
      // Cleanup handled by component unmount
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
      {/* GIF-like Animated Background */}
      <canvas ref={gifBackgroundRef} className="absolute inset-0 z-0" />

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

      {/* Animated Background Particles - Enhanced for GIF effect */}
      <div className="absolute inset-0 z-5">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-400 opacity-30"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
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

      {/* Navigation */}
      <nav
        className={`absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-6 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className="text-white text-xl animate-pulse">⚡</div>
          <span className="text-white text-sm">Menu</span>
        </div>

        <h1 className="text-white text-2xl font-bold tracking-wider">
          Thunderbull
        </h1>

        <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/50">
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
              textShadow:
                "0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 165, 0, 0.3)",
            }}
          >
            Feel the
            <br />
            <span className="text-yellow-400 text-7xl animate-pulse">
              Thunder
            </span>
          </h2>

          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Welcome to a world where mythical power
            <br />
            meets unmatched energy.
          </p>

          <button className="bg-transparent border-2 border-yellow-400 text-yellow-400 px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/50">
            ORDER
          </button>
        </div>

        {/* Center Can - Enhanced with more dynamic effects */}
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
            <img
              src="/frame_1.png"
              alt="Thunderbull Can"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side Info */}
        <div
          className={`flex-1 flex flex-col items-end space-y-8 transition-all duration-1500 delay-700 ${
            isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
          }`}
        >
          {/* Price Tag - Enhanced */}
          <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold flex items-center space-x-2 animate-bounce hover:scale-105 transition-transform duration-300 shadow-lg shadow-yellow-400/50">
            <span>💰</span>
            <span>5.2kr</span>
          </div>

          {/* Product Thumbnail - Enhanced */}
          <div className="w-24 h-32 rounded-lg overflow-hidden border-2 border-yellow-400 hover:border-yellow-300 transition-colors duration-300 hover:scale-105 transform hover:shadow-lg hover:shadow-yellow-400/50">
            <div
              className="w-full h-full animate-pulse"
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
                animationDuration: "3s",
              }}
            />
          </div>

          {/* Navigation Dots - Enhanced */}
          <div className="flex flex-col space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === 0
                    ? "bg-yellow-400 animate-pulse scale-125"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements */}
      <div
        className={`absolute top-1/3 left-1/4 w-3 h-3 bg-yellow-400 rounded-full transition-all duration-2000 delay-1500 ${
          isLoaded ? "animate-bounce opacity-80" : "opacity-0"
        }`}
        style={{
          animationDelay: "1s",
          boxShadow: "0 0 10px rgba(255, 215, 0, 0.8)",
        }}
      />
      <div
        className={`absolute top-2/3 right-1/3 w-2 h-2 bg-white rounded-full transition-all duration-2000 delay-1700 ${
          isLoaded ? "animate-ping opacity-60" : "opacity-0"
        }`}
        style={{
          animationDelay: "2s",
          boxShadow: "0 0 8px rgba(255, 255, 255, 0.6)",
        }}
      />
      <div
        className={`absolute top-1/2 left-3/4 w-4 h-4 bg-yellow-300 rounded-full transition-all duration-2000 delay-1900 ${
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

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ThunderbullLanding;
