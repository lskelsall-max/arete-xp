import { AppConfig } from './types';

export const DEFAULT_CONFIG: AppConfig = {
  levels: { elite: 6500, strong: 5000, survival: 3500 },
  maxXP: 9000,
  persona: {
    anima: "Jaguar",
    archetype: "Warrior King",
    symbol: "Tree"
  },
  library: {
    mentalModels: [
      { name: "First Principles Thinking", desc: "Reduce problems to fundamental truths, build upward." },
      { name: "Second-Order Thinking", desc: "Consider consequences beyond the immediate." },
      { name: "Inversion", desc: "Think backward: how could this fail? Then avoid it." },
      { name: "Probabilistic Thinking", desc: "Evaluate decisions using likelihoods, not certainties." },
      { name: "Hanlon’s Razor", desc: "Never attribute to malice what can be explained by stupidity." },
      { name: "Pareto Principle", desc: "80% of effects come from 20% of causes." },
      { name: "Occam’s Razor", desc: "Prefer the simplest explanation that fits the data." },
      { name: "Compound Effect", desc: "Small, smart choices + consistency + time = radical difference." },
      { name: "Circle of Competence", desc: "Operate within your area of true knowledge." },
      { name: "Map ≠ Territory", desc: "Symbols are not reality." }
    ],
    productivity: [
      { name: "Deep Work", desc: "Dedicate blocks of time to distraction-free cognitive work." },
      { name: "Eat That Frog", desc: "Do the biggest, ugliest task first thing." },
      { name: "Pomodoro Technique", desc: "25 min focus, 5 min diffuse mode." },
      { name: "2-Minute Rule", desc: "If it takes < 2 mins, do it now." },
      { name: "Time Boxing", desc: "Schedule every minute of your day." },
      { name: "Eisenhower Matrix", desc: "Urgent vs Important." },
      { name: "Flow State", desc: "Balance challenge and skill to enter the zone." }
    ],
    investors: [
      { name: "Stanley Druckenmiller", resource: "The Genius of Stan Druckenmiller", years: "30 Years" },
      { name: "Warren Buffett", resource: "Berkshire Shareholder Letters", years: "55 Years" },
      { name: "Charlie Munger", resource: "Poor Charlie's Almanack", years: "Wisdom" },
      { name: "Naval Ravikant", resource: "The Almanack of Naval Ravikant", years: "Modern" }
    ],
    quotes: [
      "“Discipline equals freedom.” — Jocko Willink",
      "“The impediment to action advances action.” — Marcus Aurelius",
      "“Slow is smooth, smooth is fast.” — Navy SEALs",
      "“We suffer more in imagination than in reality.” — Seneca",
      "“Amor Fati.” — Friedrich Nietzsche"
    ]
  },
  workouts: [
    { t: "Sunday", d: "Endurance/Cardio (Swim, Hike, Long Zone 2)" },
    { t: "Monday", d: "Lower Body Strength (Squat/Deadlift, Posterior Chain)" },
    { t: "Tuesday", d: "Sauna + Cold Exposure (3-5 Rounds)" },
    { t: "Wednesday", d: "Upper Body Strength (Push/Pull, Delts)" },
    { t: "Thursday", d: "Cardio Endurance (Row/Ski/Run/Bike/Ruck)" },
    { t: "Friday", d: "HIIT (Bike, Row, Sled, KB Swings)" },
    { t: "Saturday", d: "Hypertrophy (Arms, Core, Calves, Neck)" }
  ],
  protocols: [
    {
      title: "Health & Physiology",
      columns: 3,
      cards: [
        {
          id: "sleep",
          title: "Sleep Hygiene",
          maxXP: 1000,
          scoringType: "sum",
          items: [
            { id: "s1", label: "7+ Hours Sleep", xp: 400 },
            { id: "s2", label: "No Blue Light 1hr pre-bed", xp: 200 },
            { id: "s3", label: "Consistent Wake Time", xp: 200 },
            { id: "s4", label: "Mouth Taping / Nasal", xp: 200 }
          ]
        },
        {
          id: "nutrition",
          title: "Nutrition",
          maxXP: 1000,
          scoringType: "sum",
          items: [
            { id: "n1", label: "Clean Eating (No Junk)", xp: 300 },
            { id: "n2", label: "Hit Protein Goal", xp: 300 },
            { id: "n3", label: "Hydration (3L+)", xp: 200 },
            { id: "n4", label: "Supplements Taken", xp: 200 }
          ]
        },
        {
          id: "movement",
          title: "Movement",
          maxXP: 1000,
          scoringType: "sum",
          items: [
            { id: "m1", label: "Main Workout", xp: 500 },
            { id: "m2", label: "10k Steps", xp: 300 },
            { id: "m3", label: "Stretching/Mobility", xp: 200 }
          ]
        }
      ]
    },
    {
      title: "Deep Work & Mind",
      columns: 2,
      cards: [
        {
          id: "focus",
          title: "Deep Work",
          maxXP: 1500,
          scoringType: "sum",
          items: [
            { id: "dw1", label: "4h Deep Work", xp: 800 },
            { id: "dw2", label: "No Social Media", xp: 400 },
            { id: "dw3", label: "Plan Tomorrow", xp: 300 }
          ]
        },
        {
          id: "mind",
          title: "Mindset",
          maxXP: 1000,
          scoringType: "sum",
          items: [
            { id: "mi1", label: "Meditation (10m)", xp: 300 },
            { id: "mi2", label: "Reading (30m)", xp: 300 },
            { id: "mi3", label: "Journaling", xp: 200 },
            { id: "mi4", label: "Gratitude", xp: 200 }
          ]
        }
      ]
    }
  ]
};