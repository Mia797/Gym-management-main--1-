// src/api/exerciseApi.js
import api from './axios';

// Curated high-quality exercise library fallbacks
export const defaultExercises = [
  // Chest
  {
    id: 'ex-1',
    name: 'Barbell Bench Press',
    category: 'Chest',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    duration: 10,
    description: 'The bench press is a classic upper-body exercise that targets the chest, shoulders, and triceps.',
    instructions: [
      'Lie flat on your back on a bench.',
      'Grip the barbell with hands slightly wider than shoulder-width apart.',
      'Lower the bar slowly to your chest while keeping your elbows at a 45-degree angle.',
      'Push the bar back up powerfully to the starting position, extending your arms fully.'
    ],
    tips: 'Ensure your feet remain flat on the floor and maintain a slight arch in your lower back. Do not bounce the bar off your chest.'
  },
  {
    id: 'ex-2',
    name: 'Push-ups',
    category: 'Chest',
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    duration: 5,
    description: 'A fundamental bodyweight exercise that builds chest, shoulder, and core strength.',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulder-width.',
      'Keep your body in a straight line from head to heels.',
      'Lower your chest toward the floor by bending your elbows.',
      'Push through your palms to return to the starting position.'
    ],
    tips: 'Keep your core braced and prevent your hips from sagging or rising too high.'
  },
  {
    id: 'ex-3',
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    difficulty: 'Intermediate',
    equipment: 'Dumbbells, Incline Bench',
    duration: 8,
    description: 'Targets the upper chest (clavicular head) and anterior deltoids.',
    instructions: [
      'Set an incline bench to approximately 30-45 degrees.',
      'Sit back with a dumbbell in each hand, resting them on your thighs.',
      'Kick the weights up to shoulder height and press them straight up.',
      'Lower the weights slowly until they are in line with your upper chest, then press back up.'
    ],
    tips: 'Control the descent phase. Do not let the dumbbells touch at the top to maintain tension on the upper chest.'
  },
  
  // Back
  {
    id: 'ex-4',
    name: 'Pull-ups',
    category: 'Back',
    difficulty: 'Intermediate',
    equipment: 'Pull-up Bar',
    duration: 8,
    description: 'A premier compound exercise for building upper back width and lat strength.',
    instructions: [
      'Hang from a pull-up bar with an overhand grip, hands wider than shoulders.',
      'Depress your shoulder blades and brace your core.',
      'Pull your chest up toward the bar, driving your elbows down toward your sides.',
      'Lower yourself slowly with control until your arms are fully extended.'
    ],
    tips: 'Focus on pulling with your elbows rather than your hands to maximize lat engagement.'
  },
  {
    id: 'ex-5',
    name: 'Bent-Over Barbell Row',
    category: 'Back',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    duration: 10,
    description: 'Builds upper back thickness, targeting the lats, rhomboids, and traps.',
    instructions: [
      'Hold a barbell with an overhand grip, feet shoulder-width apart.',
      'Hinge at your hips, keeping your back flat and knees slightly bent.',
      'Pull the bar toward your lower chest, keeping your elbows close to your body.',
      'Lower the bar slowly back to the starting position.'
    ],
    tips: 'Avoid using momentum or standing up as you lift the weight. Keep your spine neutral.'
  },
  {
    id: 'ex-6',
    name: 'Deadlift',
    category: 'Back',
    difficulty: 'Advanced',
    equipment: 'Barbell, Bumper Plates',
    duration: 12,
    description: 'A ultimate full-body compound movement targeting the posterior chain, lower back, and hamstrings.',
    instructions: [
      'Stand with feet hip-width apart, shins close to the barbell.',
      'Hinge at the hips and bend knees to grip the bar, keeping your back flat.',
      'Drive through your heels to stand up, extending hips and knees fully.',
      'Lower the bar back to the floor by hinging at the hips and bending knees.'
    ],
    tips: 'Keep the bar close to your body throughout the lift. Never round your lower back under load.'
  },

  // Legs
  {
    id: 'ex-7',
    name: 'Barbell Back Squat',
    category: 'Legs',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Squat Rack',
    duration: 12,
    description: 'The king of lower-body exercises, targeting the quadriceps, glutes, and hamstrings.',
    instructions: [
      'Rest the barbell across your upper back/traps and stand feet shoulder-width apart.',
      'Hinge at your hips and bend your knees to lower your body, keeping your chest up.',
      'Squat down until thighs are parallel to the floor or lower.',
      'Drive through your heels to return to the starting position.'
    ],
    tips: 'Keep your knees aligned with your toes and do not allow them to collapse inward.'
  },
  {
    id: 'ex-8',
    name: 'Romanian Deadlift',
    category: 'Legs',
    difficulty: 'Intermediate',
    equipment: 'Barbell or Dumbbells',
    duration: 8,
    description: 'A powerful hinge movement focusing specifically on the hamstrings and glutes.',
    instructions: [
      'Stand tall holding a barbell at hip height, knees slightly unlocked.',
      'Hinge at your hips to lower the bar down your shins, keeping your back flat.',
      'Push your hips backward as far as possible until you feel a stretch in your hamstrings.',
      'Drive your hips forward and squeeze your glutes to return to standing.'
    ],
    tips: 'Maintain a flat back and keep the bar close to your thighs. Do not bend your knees further during the descent.'
  },

  // Shoulders
  {
    id: 'ex-9',
    name: 'Overhead Press',
    category: 'Shoulders',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    duration: 10,
    description: 'Builds shoulder strength and upper body power, targeting the deltoids.',
    instructions: [
      'Stand with feet shoulder-width apart, holding the barbell at collarbone level.',
      'Brace your core, squeeze your glutes, and press the bar straight up overhead.',
      'Push your head slightly forward as the bar clears your face.',
      'Lock out your arms at the top, then slowly lower the bar back to your chest.'
    ],
    tips: 'Do not use your legs to help lift the weight (keep it a strict press). Avoid excessive arching of the lower back.'
  },
  {
    id: 'ex-10',
    name: 'Dumbbell Lateral Raise',
    category: 'Shoulders',
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    duration: 6,
    description: 'Isolates the lateral deltoid to help build shoulder width and a V-taper.',
    instructions: [
      'Stand tall holding a dumbbell in each hand at your sides.',
      'With a slight bend in your elbows, raise the weights out to the sides.',
      'Lift until your arms are parallel to the floor (shoulder height).',
      'Lower the dumbbells slowly back to your sides.'
    ],
    tips: 'Lead the movement with your elbows and pinky fingers. Do not swing the weights.'
  },

  // Arms
  {
    id: 'ex-11',
    name: 'Dumbbell Bicep Curl',
    category: 'Arms',
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    duration: 5,
    description: 'Classic isolation exercise targeting the biceps brachii.',
    instructions: [
      'Stand holding a dumbbell in each hand, palms facing forward.',
      'Keep your elbows pinned close to your torso.',
      'Curl the weights upward while contracting your biceps.',
      'Lower the weights back down slowly to the starting position.'
    ],
    tips: 'Keep your wrists straight and avoid swinging your torso to lift the dumbbells.'
  },
  {
    id: 'ex-12',
    name: 'Tricep Overhead Extension',
    category: 'Arms',
    difficulty: 'Beginner',
    equipment: 'Dumbbell',
    duration: 6,
    description: 'Isolates the triceps, specifically targeting the long head of the muscle.',
    instructions: [
      'Stand or sit and hold a single dumbbell overhead with both hands.',
      'Keep your upper arms close to your head and perpendicular to the floor.',
      'Lower the weight behind your head by bending only at the elbows.',
      'Press the weight back up to the starting position by contracting your triceps.'
    ],
    tips: 'Keep your elbows pointing forward, not flaring out to the sides.'
  },

  // Core
  {
    id: 'ex-13',
    name: 'Plank',
    category: 'Core',
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    duration: 4,
    description: 'An isometric core strength exercise that improves posture and spinal stability.',
    instructions: [
      'Rest your forearms on the floor, elbows aligned under shoulders.',
      'Extend your legs straight behind you, toes on the floor.',
      'Brace your core and squeeze your glutes, keeping a straight line from head to heels.',
      'Hold this position while breathing normally.'
    ],
    tips: 'Do not let your hips sag or push your glutes up toward the ceiling.'
  },
  {
    id: 'ex-14',
    name: 'Hanging Leg Raise',
    category: 'Core',
    difficulty: 'Intermediate',
    equipment: 'Pull-up Bar',
    duration: 7,
    description: 'An advanced core exercise targeting the lower abs and hip flexors.',
    instructions: [
      'Hang from a pull-up bar with arms fully extended.',
      'Keep your legs straight and raise them until they are parallel to the floor.',
      'Pause for a moment at the top of the movement.',
      'Lower your legs slowly back to the starting position.'
    ],
    tips: 'Control the descent phase and avoid swinging your body to gain momentum.'
  }
];

// Fetch exercises (with optional filters)
export const getExercises = async (search = '', category = '', difficulty = '') => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);

    const res = await api.get(`/exercises?${params.toString()}`);
    return res;
  } catch (error) {
    console.warn('Backend exercise endpoint failed or missing. Using curated client library.');
    // Perform client-side filtering on fallback data
    let filtered = [...defaultExercises];
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q)
      );
    }
    
    if (category) {
      filtered = filtered.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }
    
    if (difficulty) {
      filtered = filtered.filter(e => e.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    return {
      data: {
        success: true,
        exercises: filtered
      }
    };
  }
};
