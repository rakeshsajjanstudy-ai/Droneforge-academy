// src/pages/ComponentsPage.jsx
import { useState } from 'react'

const COMPONENT_TABS = [
  {
    id: 'fc', icon: '🧠', label: 'Flight Controller',
    title: 'Flight Controller (FC)',
    desc: 'The brain of your drone. Processes sensor data and controls motor outputs to maintain stable flight. Runs flight firmware like Betaflight, ArduPilot, or iNav.',
    details: [
      { label: 'Popular Firmware', value: 'Betaflight · iNav · ArduPilot' },
      { label: 'Key Specs', value: 'Gyro, CPU speed, UART ports, ESC protocol' },
      { label: 'Price Range', value: '$20 – $120' },
      { label: 'Recommended Beginner', value: 'SpeedyBee F405 V4' },
    ],
    tips: ['Look for 6x UARTs for peripheral support', 'Ensure gyro model is well-supported (MPU6000, ICM42688)', 'Dual gyro for filtering advantage'],
    warning: 'Avoid clones with fake gyro chips — they cause poor flight performance.',
  },
  {
    id: 'esc', icon: '⚡', label: 'ESC',
    title: 'Electronic Speed Controller (ESC)',
    desc: 'Converts FC signals to precise motor power. Available as 4-in-1 (single board for all motors) or individual units. Runs BLHeli_32 or AM32 firmware.',
    details: [
      { label: 'Protocols', value: 'DSHOT300 · DSHOT600 · DSHOT1200' },
      { label: 'Key Specs', value: 'Amperage rating, voltage input, protocol support' },
      { label: 'Price Range', value: '$25 – $80 (4-in-1)' },
      { label: 'Recommended', value: '45A 4-in-1 for 5" builds' },
    ],
    tips: ['Match amp rating to motor draw (with headroom)', 'DSHOT600 is standard for modern builds', 'BLHeli_32 supports telemetry, AM32 is open source'],
  },
  {
    id: 'motor', icon: '🔄', label: 'Motors',
    title: 'Brushless Motors',
    desc: 'Three-phase brushless motors provide power and efficiency. Specified by stator dimensions (e.g., 2306 = 23mm wide, 6mm tall) and KV rating (RPM per volt).',
    details: [
      { label: 'Size Convention', value: 'WWLL (width/length in mm)' },
      { label: 'KV Rating', value: 'Higher KV = faster, lower KV = more torque' },
      { label: 'Price Range', value: '$12 – $35 each' },
      { label: 'Common Sizes', value: '1404 (3"), 2306 (5"), 2812 (7")' },
    ],
    tips: ['For 5" freestyle: 2306 2400KV on 4S', 'For 5" cine: 2306 1700KV on 6S', 'Check thrust-to-weight ratio (3:1 minimum)'],
  },
  {
    id: 'battery', icon: '🔋', label: 'Battery',
    title: 'LiPo Battery',
    desc: 'Lithium Polymer batteries power the entire build. Specified by cell count (S), capacity (mAh), and C-rating (discharge rate). Critical for performance and safety.',
    details: [
      { label: 'Cell Voltage', value: '3.7V nominal, 4.2V full, 3.5V minimum' },
      { label: 'Common Configs', value: '3S (11.1V) · 4S (14.8V) · 6S (22.2V)' },
      { label: 'Price Range', value: '$15 – $60 per pack' },
      { label: 'Capacity Guide', value: '1300–1500mAh for 5" freestyle' },
    ],
    tips: ['Never discharge below 3.5V/cell', 'Store at 3.8V/cell for longevity', 'Use a LiPo-safe bag for charging'],
    warning: '⚠ LiPo fires are serious. Always charge supervised and never leave unattended.',
  },
  {
    id: 'frame', icon: '🏗️', label: 'Frame',
    title: 'Drone Frame',
    desc: 'Carbon fiber structure that holds everything together. Frame size is measured by the diagonal motor-to-motor distance. Design affects airflow, durability, and weight.',
    details: [
      { label: 'Common Sizes', value: '3" (micro) · 5" (standard) · 7" (long range)' },
      { label: 'Material', value: '3K Carbon Fiber (3–5mm thickness for arms)' },
      { label: 'Price Range', value: '$30 – $150' },
      { label: 'Layouts', value: 'True-X · Stretch-X · Dead-Cat' },
    ],
    tips: ['Stretch-X for better freestyle feel', 'True-X for balanced performance', '5mm arms for 5" durability'],
  },
  {
    id: 'vtx', icon: '📡', label: 'VTX & Camera',
    title: 'Video Transmitter & Camera',
    desc: 'For FPV flying. The camera captures your view, the VTX transmits it to your goggles. Analog (lower latency, longer range) or digital (HD quality, higher latency).',
    details: [
      { label: 'Analog Systems', value: 'AKK, TBS Unify, IRC Tramp' },
      { label: 'Digital Systems', value: 'DJI O3, Walksnail Avatar, HDZero' },
      { label: 'Price Range', value: '$20 (analog) – $250 (digital)' },
      { label: 'Power Output', value: '25mW – 1W (legal limits vary)' },
    ],
    tips: ['DJI O3 for best image quality', 'Analog for budget FPV', 'Check local VTX power limits'],
  },
]

export default function ComponentsPage() {
  const [active, setActive] = useState('fc')
  const comp = COMPONENT_TABS.find(c => c.id === active)

  return (
    <div className="min-h-screen pt-28 pb-20 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="font-mono-code text-[0.7rem] text-[var(--neon-orange)] tracking-[4px] uppercase mb-3">Reference</div>
        <h1 className="font-orbitron text-4xl font-black text-white mb-3">Component Guide</h1>
        <p className="text-[var(--text-muted)] max-w-xl mb-12 leading-relaxed">
          Deep-dive into every major component — what it does, what to look for, and what to buy.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Tab sidebar */}
          <div className="flex flex-col gap-1">
            {COMPONENT_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-3 px-5 py-3.5 text-left border-l-2 transition-all font-rajdhani font-semibold ${
                  active === tab.id
                    ? 'border-l-[var(--neon-cyan)] bg-[rgba(0,245,255,0.06)] text-[var(--neon-cyan)]'
                    : 'border-l-[rgba(0,245,255,0.1)] text-[var(--text-muted)] hover:text-[var(--neon-cyan)] hover:border-l-[rgba(0,245,255,0.4)] hover:bg-[rgba(0,245,255,0.03)]'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-sm tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {comp && (
            <div className="panel clip-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{comp.icon}</span>
                <div>
                  <div className="font-mono-code text-[0.65rem] text-[var(--neon-orange)] tracking-widest uppercase mb-1">Component Deep Dive</div>
                  <h2 className="font-orbitron text-2xl font-bold text-white">{comp.title}</h2>
                </div>
              </div>

              <p className="text-[var(--text-muted)] leading-relaxed mb-8 text-base">{comp.desc}</p>

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {comp.details.map(({ label, value }) => (
                  <div key={label} className="p-4 bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.08)]">
                    <div className="font-mono-code text-[0.62rem] text-[var(--text-muted)] tracking-widest uppercase mb-1.5">{label}</div>
                    <div className="font-orbitron text-sm font-bold text-[var(--neon-cyan)]">{value}</div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className="mb-5">
                <div className="font-mono-code text-[0.65rem] text-[var(--neon-cyan)] tracking-widest uppercase mb-3">Pro Tips</div>
                <ul className="flex flex-col gap-2.5">
                  {comp.tips.map(tip => (
                    <li key={tip} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                      <span className="text-[var(--neon-cyan)] text-xs mt-0.5 flex-shrink-0">▸</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {comp.warning && (
                <div className="p-4 bg-[rgba(255,107,0,0.08)] border-l-2 border-[var(--neon-orange)] text-sm text-[rgba(255,200,150,0.9)] leading-relaxed">
                  {comp.warning}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
