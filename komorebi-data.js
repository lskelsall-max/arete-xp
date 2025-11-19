// KOMOREBI OS - DATA & CONFIGURATION
// Edit this file to change content, scoring, and protocols.

const DEFAULT_CONFIG =
    // 1. SYSTEM CONSTANTS
    levels: {
        elite: 6500,
        strong: 5000,
        survival: 3500
    },
    maxXP: 9000,

    // 2. KNOWLEDGE BASE (The Library)
    // Add or remove items here to update your "Reader" and "Daily Prompts"
    library: {
        mentalModels: [
            { name: "First Principles", desc: "Reduce problems to fundamental truths, build upward." },
            { name: "Inversion", desc: "Think backward: how could this fail? Then avoid it." },
            { name: "Circle of Competence", desc: "Operate within your area of true knowledge." },
            { name: "Hanlon's Razor", desc: "Never attribute to malice what is explained by stupidity." },
            { name: "Pareto Principle", desc: "80% of effects come from 20% of causes." },
            // ... Paste the rest of your 300+ models here
        ],
        productivity: [
            { name: "5 Second Rule", desc: "Count 5-4-3-2-1-GO to bypass hesitation." },
            { name: "Deep Work", desc: "Dedicate blocks of time to distraction-free cognitive work." },
            { name: "Eat That Frog", desc: "Do the biggest, ugliest task first thing." },
            // ... Add your productivity hacks here
        ],
        investors: [
            { name: "Warren Buffett", resource: "Berkshire Shareholder Letters", years: "55 Years" },
            { name: "Stanley Druckenmiller", resource: "The Genius of Stan Druckenmiller", years: "30 Years" },
            { name: "Charlie Munger", resource: "Poor Charlie's Almanack", years: "15+ Years" },
            // ... Add your investor list here
        ],
        quotes: [
            "“Discipline equals freedom.” — Jocko Willink",
            "“The impediment to action advances action.” — Marcus Aurelius",
            "“The score takes care of itself.” — Bill Walsh",
            // ... Add your quotes here
        ]
    },

    // 3. PROTOCOL DEFINITIONS (The Checkboxes)
    // Define your cards, checkboxes, and scoring logic here.
    // The UI will automatically build itself based on this list.
    protocols: [
        {
            id: "health",
            title: "Health (Body Fat < 16%)",
            columns: 3, // How many cards in this row?
            cards: [
                {
                    id: "supplements",
                    title: "Jaguar Fuel",
                    maxXP: 500,
                    items: [
                        { id: "supplementStack", label: "Smoothie & Supps Stack", xp: 500 }
                        // You can add a 'details' array here if you want the dropdown back
                    ]
                },
                {
                    id: "fitness",
                    title: "Jaguar Physique",
                    maxXP: 1000,
                    // Logic: "count" means XP is based on how many are checked
                    // "multiplier" means 333 XP per check.
                    scoringType: "count_multiplier", 
                    perItemXP: 334, // 3 items * 334 ≈ 1000
                    items: [
                        { id: "workout", label: "Workout (Huberman/Johnson)" },
                        { id: "corrective", label: "Corrective/Postural (10m)" },
                        { id: "zone2", label: "Zone 2 / Ruck" }
                    ]
                },
                {
                    id: "aesthetics",
                    title: "Aesthetics",
                    maxXP: 500,
                    scoringType: "count_multiplier",
                    perItemXP: 166,
                    items: [
                        { id: "grooming", label: "Grooming/Skin" },
                        { id: "posture", label: "Posture Wall Sits" },
                        { id: "guaSha", label: "Gua Sha / Ice Roll" }
                    ]
                }
            ]
        },
        {
            id: "mind",
            title: "Mind & Meaning",
            columns: 3,
            cards: [
                {
                    id: "wisdom",
                    title: "Mental Resilience",
                    maxXP: 1000,
                    scoringType: "count_multiplier",
                    perItemXP: 250,
                    items: [
                        { id: "meditate", label: "FitMind / Meditation" },
                        { id: "slowThink", label: "Slow Thinking (10m)" },
                        { id: "gratitude", label: "Evening Gratitude" },
                        { id: "stoicReflect", label: "Stoic Reflection" }
                    ]
                },
                {
                    id: "values",
                    title: "Core Values",
                    maxXP: 1000,
                    scoringType: "count_multiplier",
                    perItemXP: 200,
                    items: [
                        { id: "valStrength", label: "Strength" },
                        { id: "valBeauty", label: "Beauty" },
                        { id: "valService", label: "Service" },
                        { id: "valFamily", label: "Family" },
                        { id: "valWisdom", label: "Wisdom" }
                    ]
                },
                {
                    id: "arete",
                    title: "Anti-Mimetic",
                    maxXP: 500,
                    scoringType: "count_multiplier",
                    perItemXP: 250,
                    items: [
                        { id: "antiMimetic", label: "Avoided 'The Crowd'" },
                        { id: "legacy", label: "Legacy Action" }
                    ]
                }
            ]
        },
        {
            id: "learning",
            title: "Learning & Productivity",
            columns: 2,
            cards: [
                {
                    id: "mastery",
                    title: "Ultralearning",
                    maxXP: 2000,
                    scoringType: "count_multiplier",
                    perItemXP: 666,
                    items: [
                        { id: "metalearning", label: "Metalearning Map" },
                        { id: "drill", label: "Drill Weaknesses" },
                        { id: "overlearn", label: "Overlearn/Teach" }
                    ]
                },
                {
                    id: "responsibility",
                    title: "Second Brain",
                    maxXP: 2000,
                    scoringType: "count_multiplier",
                    perItemXP: 666,
                    items: [
                        { id: "sbCapture", label: "Capture (Notes)" },
                        { id: "sbOrganize", label: "Organize (PARA)" },
                        { id: "sbDistill", label: "Distill (Summary)" }
                    ]
                }
            ]
        }
    ]
};
