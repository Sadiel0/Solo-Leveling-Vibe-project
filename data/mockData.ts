import { DailyProtocols, Quote } from '../types';

export const quotes: Quote[] = [
  {
    text: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch",
    category: "stoic"
  },
  {
    text: "What stands in the way becomes the way.",
    author: "Marcus Aurelius",
    category: "stoic"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivational"
  },
  {
    text: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn",
    category: "motivational"
  },
  {
    text: "The body is the temple of the soul.",
    author: "Ancient Proverb",
    category: "philosophical"
  },
  {
    text: "Strength does not come from the physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi",
    category: "philosophical"
  },
  {
    text: "The soul becomes dyed with the color of its thoughts.",
    author: "Marcus Aurelius",
    category: "stoic"
  },
  {
    text: "Every day is a new beginning. Take a deep breath and start again.",
    author: "Anonymous",
    category: "motivational"
  }
];

export const protocols: DailyProtocols = {
  mind: [
    {
      id: "mind-1",
      name: "Morning Meditation",
      description: "10 minutes of focused breathing and mental clarity",
      xpReward: 50,
      category: "mind",
      difficulty: "easy",
      duration: "10 minutes"
    },
    {
      id: "mind-2",
      name: "Read 30 Pages",
      description: "Read from a book that expands your knowledge",
      xpReward: 75,
      category: "mind",
      difficulty: "medium",
      duration: "30 minutes"
    },
    {
      id: "mind-3",
      name: "Learn New Skill",
      description: "Spend time learning something completely new",
      xpReward: 100,
      category: "mind",
      difficulty: "hard",
      duration: "1 hour"
    }
  ],
  body: [
    {
      id: "body-1",
      name: "Push-ups",
      description: "Complete 3 sets of 10 push-ups",
      xpReward: 60,
      category: "body",
      difficulty: "easy",
      duration: "10 minutes"
    },
    {
      id: "body-2",
      name: "Cardio Session",
      description: "30 minutes of running, cycling, or swimming",
      xpReward: 80,
      category: "body",
      difficulty: "medium",
      duration: "30 minutes"
    },
    {
      id: "body-3",
      name: "Strength Training",
      description: "Full body workout with weights",
      xpReward: 120,
      category: "body",
      difficulty: "hard",
      duration: "45 minutes"
    }
  ],
  spirit: [
    {
      id: "spirit-1",
      name: "Gratitude Journal",
      description: "Write down 3 things you're grateful for today",
      xpReward: 40,
      category: "spirit",
      difficulty: "easy",
      duration: "5 minutes"
    },
    {
      id: "spirit-2",
      name: "Nature Walk",
      description: "Take a mindful walk in nature",
      xpReward: 70,
      category: "spirit",
      difficulty: "medium",
      duration: "20 minutes"
    },
    {
      id: "spirit-3",
      name: "Deep Reflection",
      description: "Spend time in deep self-reflection and journaling",
      xpReward: 90,
      category: "spirit",
      difficulty: "hard",
      duration: "30 minutes"
    }
  ]
};

export const getRandomQuote = (): Quote => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getDailyProtocols = (): DailyProtocols => {
  return protocols;
}; 