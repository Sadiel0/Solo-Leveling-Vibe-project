import axios from 'axios';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

// IMPORTANT: Set your OpenAI API key in a .env file and load it via app.config.js or expo-constants
// Example: OPENAI_API_KEY=sk-... in .env
// For Expo, use Constants.manifest.extra.OPENAI_API_KEY

const WORKOUT_PATH = FileSystem.documentDirectory + 'today_workout.json';
const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY || '';

console.log('OpenAI Key:', OPENAI_API_KEY);

export interface Workout {
  title: string;
  description: string;
  exercises: { name: string; reps: string; notes?: string }[];
  xpReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  date: string;
}

export async function getTodayWorkout(): Promise<{ workout: Workout | null; error?: string }> {
  const today = new Date().toISOString().slice(0, 10);
  // Try to load existing workout
  try {
    const file = await FileSystem.readAsStringAsync(WORKOUT_PATH);
    const data = JSON.parse(file);
    if (data.date === today) {
      return { workout: data };
    }
  } catch (e) {
    // File may not exist, continue
  }

  // Generate new workout via OpenAI
  try {
    const prompt = `Generate a circuit workout for today that is advanced difficulty, lasts under 40 minutes, and is suitable for a highly fit athlete. Return JSON with: title, description, exercises (array of {name, reps, notes?}), xpReward (int), difficulty (Easy|Medium|Hard), and ensure the workout is challenging and unique for today.`;
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a world-class athletic coach.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // Try to parse the response
    let workout: Workout | null = null;
    try {
      const text = response.data.choices[0].message.content;
      workout = JSON.parse(text);
      if (workout) {
        workout.date = today;
      }
    } catch (err) {
      return { workout: null, error: 'Failed to parse OpenAI response.' };
    }
    // Save to file
    await FileSystem.writeAsStringAsync(WORKOUT_PATH, JSON.stringify(workout, null, 2));
    return { workout };
  } catch (err: any) {
    return { workout: null, error: 'Failed to generate workout: ' + (err?.message || 'Unknown error') };
  }
} 