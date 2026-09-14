import React, { useState, useEffect, useRef } from "react";
import "./AnalysisLoader.css";

const STEPS = [
  { id: 1, label: "PDF extracted successfully", delay: 500, type: "done" },
  { id: 2, label: "SHA-256 hash computed", delay: 900, type: "done" },
  { id: 3, label: "Redis cache checked → miss", delay: 1300, type: "done" },
  { id: 4, label: "Sending to Groq AI...", delay: 1700, type: "loading" },
  { id: 5, label: "Extracting ATS keywords...", delay: 2800, type: "loading" },
  { id: 6, label: "Scoring match quality...", delay: 4200, type: "loading" },
  { id: 7, label: "Generating bullet rewrites...", delay: 5600, type: "loading" },
];

const CACHE_HIT_STEPS = [
  { id: 1, label: "PDF extracted successfully", delay: 200, type: "done" },
  { id: 2, label: "SHA-256 hash computed", delay: 450, type: "done" },
  { id: 3, label: "Redis cache HIT → returning cached result", delay: 750, type: "done" },
];

export default function AnalysisLoader({ isCacheHit = false, onComplete }) {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const timers = useRef([]);

  useEffect(() => {
    // Clear any previous scheduled timers
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const stepsToRun = isCacheHit ? CACHE_HIT_STEPS : STEPS;

    // Reset visible steps
    setVisibleSteps([]);

    stepsToRun.forEach((step) => {
      const t = setTimeout(() => {
        setVisibleSteps((prev) => {
          if (prev.some((s) => s.id === step.id)) {
            return prev.map((s) => (s.id === step.id ? step : s));
          }
          return [...prev, step];
        });
      }, step.delay);
      timers.current.push(t);
    });

    if (isCacheHit) {
      const finishTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 950);
      timers.current.push(finishTimer);
    }

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [isCacheHit, onComplete]);

  return (
    <div className="loader-container">
      <div className="loader-title">
        <span className="spinner-ring" />
        AI Analysis in progress
      </div>
      <div className="loader-steps">
        {visibleSteps.map((step) => (
          <div key={step.id} className={`step step--${step.type}`}>
            <span className="step-icon">
              {step.type === "done" ? "✓" : <span className="pulse-dot" />}
            </span>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
