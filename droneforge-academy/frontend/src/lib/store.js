// src/lib/store.js
// Global Zustand store — UI state, courses, builds

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── UI STORE ───────────────────────────────
export const useUIStore = create((set) => ({
  sidebarOpen: false,
  activeModal: null,
  theme: 'dark',
  setSidebar: (open) => set({ sidebarOpen: open }),
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
}))

// ─── DRONE DATA STORE ────────────────────────
export const useDroneStore = create((set, get) => ({
  drones: [
    {
      id: 'mini-quad',
      type: 'beginner',
      icon: '🚁',
      name: 'Mini Quadcopter',
      category: 'Beginner',
      desc: 'Perfect starting point. Four motors, simple controller, forgiving flight. Great for learning basic maneuvers indoors and in calm conditions.',
      color: 'cyan',
      specs: { maxSpeed: '40 km/h', range: '100m', weight: '250g', flightTime: '8 min', cost: '$80–$150' },
      difficulty: 'beginner',
      specBars: { speed: 30, range: 20, durability: 80, features: 25 },
    },
    {
      id: 'fpv-racer',
      type: 'intermediate',
      icon: '⚡',
      name: 'FPV Racing Drone',
      category: 'Intermediate',
      desc: 'Built for speed and agility. First-person view camera, 5" propellers, high-torque motors. The thrill machine of the drone world.',
      color: 'orange',
      specs: { maxSpeed: '160 km/h', range: '500m', weight: '320g', flightTime: '4 min', cost: '$250–$600' },
      difficulty: 'intermediate',
      specBars: { speed: 95, range: 50, durability: 55, features: 60 },
    },
    {
      id: 'cinema',
      type: 'advanced',
      icon: '🎬',
      name: 'Cinema Drone',
      category: 'Advanced',
      desc: 'Professional aerial cinematography. 3-axis gimbal, 4K camera, GPS hold, obstacle avoidance. The workhorse of aerial filmmakers.',
      color: 'gold',
      specs: { maxSpeed: '65 km/h', range: '8km', weight: '1.8kg', flightTime: '31 min', cost: '$1,500–$4,000' },
      difficulty: 'advanced',
      specBars: { speed: 50, range: 85, durability: 75, features: 95 },
    },
    {
      id: 'freestyle',
      type: 'intermediate',
      icon: '🌀',
      name: 'Freestyle Drone',
      category: 'Intermediate',
      desc: 'Acrobatics and flow flying. Soft motor tuning, durable frame, betaflight setup. Express your style through flight.',
      color: 'purple',
      specs: { maxSpeed: '120 km/h', range: '600m', weight: '410g', flightTime: '5 min', cost: '$200–$450' },
      difficulty: 'intermediate',
      specBars: { speed: 75, range: 55, durability: 70, features: 65 },
    },
    {
      id: 'mapping',
      type: 'advanced',
      icon: '🗺️',
      name: 'Mapping Drone',
      category: 'Advanced',
      desc: 'Precision agriculture and surveying. Fixed-wing hybrid design, high-accuracy GPS, downward-facing camera, long range.',
      color: 'green',
      specs: { maxSpeed: '70 km/h', range: '15km', weight: '2.5kg', flightTime: '55 min', cost: '$2,000–$8,000' },
      difficulty: 'advanced',
      specBars: { speed: 40, range: 98, durability: 85, features: 90 },
    },
    {
      id: 'micro-fpv',
      type: 'beginner',
      icon: '🔬',
      name: 'Micro FPV Whoop',
      category: 'Beginner',
      desc: 'Tiny indoor FPV platform with prop guards. Perfect for learning FPV skills in your living room before going outside.',
      color: 'red',
      specs: { maxSpeed: '60 km/h', range: '100m', weight: '32g', flightTime: '4 min', cost: '$25–$80' },
      difficulty: 'beginner',
      specBars: { speed: 45, range: 10, durability: 60, features: 35 },
    },
  ],
  selectedDrone: null,
  selectDrone: (id) => set({ selectedDrone: get().drones.find(d => d.id === id) }),
  clearSelection: () => set({ selectedDrone: null }),
}))

// ─── BUILD WIZARD STORE ──────────────────────
export const useBuildStore = create(
  persist(
    (set, get) => ({
      currentBuild: null,
      wizardStep: 0,
      selectedParts: {},

      startBuild: (droneType) => set({
        currentBuild: {
          droneType,
          name: `My ${droneType} Build`,
          createdAt: new Date().toISOString(),
        },
        wizardStep: 0,
        selectedParts: {},
      }),

      nextStep: () => set((s) => ({ wizardStep: s.wizardStep + 1 })),
      prevStep: () => set((s) => ({ wizardStep: Math.max(0, s.wizardStep - 1) })),

      selectPart: (category, part) => set((s) => ({
        selectedParts: { ...s.selectedParts, [category]: part },
      })),

      resetBuild: () => set({ currentBuild: null, wizardStep: 0, selectedParts: {} }),

      getTotalCost: () => {
        const parts = get().selectedParts
        return Object.values(parts).reduce((sum, p) => sum + (p?.price || 0), 0)
      },
    }),
    { name: 'droneforge-build', skipHydration: false }
  )
)

// ─── PROGRESS STORE ──────────────────────────
export const useProgressStore = create(
  persist(
    (set, get) => ({
      completedLessons: {},
      completedCourses: [],
      xp: 0,

      markComplete: (courseId, lessonId) => {
        const key = `${courseId}:${lessonId}`
        if (!get().completedLessons[key]) {
          set((s) => ({
            completedLessons: { ...s.completedLessons, [key]: true },
            xp: s.xp + 50,
          }))
        }
      },

      isComplete: (courseId, lessonId) => {
        return !!get().completedLessons[`${courseId}:${lessonId}`]
      },

      getCoursePercent: (courseId, totalLessons) => {
        const done = Object.keys(get().completedLessons)
          .filter(k => k.startsWith(`${courseId}:`)).length
        return totalLessons > 0 ? Math.round((done / totalLessons) * 100) : 0
      },
    }),
    { name: 'droneforge-progress' }
  )
)
