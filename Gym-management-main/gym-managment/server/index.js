// server/index.js
// Simple Express backend to illustrate role handling for registration
// This file is a minimal example; integrate with your existing backend as needed.

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} - Body:`, req.body);
  next();
});

// In‑memory store for demo purposes
const users = [
  { id: 1, name: 'Demo User', email: 'user@goldfit.local', password: 'password', balance: 500, role: 'user', createdAt: new Date() },
  { id: 2, name: 'Admin User', email: 'admin@goldfit.local', password: 'password', balance: 0, role: 'admin', createdAt: new Date() }
];
let specialistProfile = {
  bio: 'Certified specialist in high-performance programs.',
  experience_years: 5,
  achievements: 'Gold Standard Certification'
};

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, age, gender, address, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields (email, password, role).' });
  }
  // Simple duplicate check
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already registered.' });
  }
  const newUser = {
    id: users.length + 1,
    name: name || `${email.split('@')[0]}`,
    email,
    password, // NOTE: In production hash passwords!
    phone: phone || '',
    age: age || null,
    gender: gender || 'male',
    address: address || '',
    role: role || 'user',
    createdAt: new Date()
  };
  users.push(newUser);
  // Return a minimal success payload
  res.status(201).json({ message: 'User registered successfully', id: newUser.id, role: newUser.role });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // In a real app issue a JWT or session cookie
  res.json({ message: 'Login successful', user: { id: user.id, name: user.name, role: user.role, email: user.email } });
});

app.get('/api/auth/profile', (req, res) => {
  // For demo we just return the first user (no auth check needed for simple mock)
  if (users.length === 0) return res.status(404).json({ error: 'No users' });
  const user = users[users.length - 1]; // return last logged in / registered user
  res.json({ user: { ...user, role_name: user.role } });
});

// Specialist dashboard endpoint
app.get('/api/specialists/dashboard', (req, res) => {
  res.json({
    active_clients: 3,
    rating: 4.9,
    earnings: 1850,
    specialist_profile: specialistProfile,
    client_plans: [
      { id: 1, clientName: 'Alice Johnson', status: 'Planning' },
      { id: 2, clientName: 'Bob Williams', status: 'Active' },
      { id: 3, clientName: 'Charlie Brown', status: 'Planning' }
    ]
  });
});

// Specialist profile update
app.post('/api/auth/specialist-profile', (req, res) => {
  const { bio, achievements, experience_years } = req.body;
  specialistProfile = {
    bio: bio || specialistProfile.bio,
    achievements: achievements || specialistProfile.achievements,
    experience_years: experience_years || specialistProfile.experience_years
  };
  res.json({ message: 'Specialist profile updated successfully', profile: specialistProfile });
});

// Add exercises to training plan
app.post('/api/training/plans/add-exercises', (req, res) => {
  const { planId, exercises } = req.body;
  res.json({ message: 'Exercises successfully published to plan', planId, count: exercises?.length || 0 });
});

// Add meals to nutrition plan
app.post('/api/nutrition/plans/add-meals', (req, res) => {
  const { planId, meals } = req.body;
  res.json({ message: 'Meals successfully published to plan', planId, count: meals?.length || 0 });
});

// Mock Database for Exercises and Meals
const mockExercises = [
  {
    id: 1,
    name: 'Barbell Bench Press',
    category: 'Chest',
    muscle_name: 'Chest',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    equipment_name: 'Barbell, Bench',
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
    id: 2,
    name: 'Push-ups',
    category: 'Chest',
    muscle_name: 'Chest',
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    equipment_name: 'Bodyweight',
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
    id: 3,
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    muscle_name: 'Chest',
    difficulty: 'Intermediate',
    equipment: 'Dumbbells, Incline Bench',
    equipment_name: 'Dumbbells, Incline Bench',
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
  {
    id: 4,
    name: 'Pull-ups',
    category: 'Back',
    muscle_name: 'Back / Lats',
    difficulty: 'Intermediate',
    equipment: 'Pull-up Bar',
    equipment_name: 'Pull-up Bar',
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
    id: 5,
    name: 'Bent-Over Barbell Row',
    category: 'Back',
    muscle_name: 'Back / Rhomboids',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    equipment_name: 'Barbell',
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
    id: 6,
    name: 'Barbell Back Squat',
    category: 'Legs',
    muscle_name: 'Legs / Quads',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Squat Rack',
    equipment_name: 'Barbell, Squat Rack',
    duration: 12,
    description: 'The king of lower-body exercises, targeting the quadriceps, glutes, and hamstrings.',
    instructions: [
      'Rest the barbell across your upper back/traps and stand feet shoulder-width apart.',
      'Hinge at your hips and bend your knees to lower your body, keeping your chest up.',
      'Squat down until thighs are parallel to the floor or lower.',
      'Drive through your heels to return to the starting position.'
    ],
    tips: 'Keep your knees aligned with your toes and do not allow them to collapse inward.'
  }
];

const mockMeals = [
  {
    id: '1',
    name: 'Gladiator Beef & Rice Skillet',
    goal: 'Bulking',
    meal_type: 'Bulking Fuel',
    calories: '680',
    protein: '45',
    carbs: '60',
    fats: '15',
    fat: '15',
    serving_size: '350',
    prepTime: '20 mins',
    description: 'A heavy-duty clean bulking staple loaded with lean beef, jasmine rice, and healthy micronutrients to fuel maximum recovery.',
    ingredients: [
      '200g Lean Ground Beef (93/7)',
      '1.5 cups Cooked Jasmine Rice',
      '1/2 cup Bell Peppers (chopped)',
      '1/4 cup Low-Sodium Beef Broth',
      '1 tbsp Olive Oil'
    ],
    preparation_steps: 'Heat olive oil. Cook beef and peppers. Add seasoning, rice, and broth. Simmer for 5 mins.',
    instructions: [
      'Heat olive oil in a large skillet over medium-high heat.',
      'Add ground beef and chopped bell peppers, cooking until beef is fully browned.',
      'Drain excess fat if necessary, then add seasonings (garlic, salt, pepper).',
      'Pour in the jasmine rice and beef broth, stirring continuously for 3-5 minutes until heated through.'
    ]
  },
  {
    id: '2',
    name: 'Powerhouse Oats & PB Bowl',
    goal: 'Bulking',
    meal_type: 'Breakfast',
    calories: '580',
    protein: '26',
    carbs: '68',
    fats: '20',
    fat: '20',
    serving_size: '250',
    prepTime: '10 mins',
    description: 'A high-calorie, carb-dense breakfast bowl packed with complex carbs, fiber, and premium proteins.',
    ingredients: [
      '1 cup Rolled Oats',
      '1.5 cups Whole Milk',
      '1 scoop Whey Protein',
      '2 tbsp Organic Peanut Butter'
    ],
    preparation_steps: 'Boil oats in milk. Cool for 1 min. Mix in protein. Top with peanut butter and honey.',
    instructions: [
      'Combine rolled oats and milk in a pot, bringing it to a light boil over medium heat.',
      'Reduce heat and simmer for 5 minutes, stirring occasionally.',
      'Remove from heat, let cool, and stir in whey protein.',
      'Top with peanut butter and sliced bananas.'
    ]
  },
  {
    id: '3',
    name: 'Lemon Herb Grilled Chicken',
    goal: 'Cutting',
    meal_type: 'Cutting Split',
    calories: '340',
    protein: '42',
    carbs: '12',
    fats: '6',
    fat: '6',
    serving_size: '200',
    prepTime: '15 mins',
    description: 'The ultimate cutting classic. Low in fat and carbs, but packed with lean chicken breast protein.',
    ingredients: [
      '180g Boneless Skinless Chicken Breast',
      '10-12 Asparagus Spears',
      '1 tsp Olive Oil',
      '1/2 Lemon (squeezed)'
    ],
    preparation_steps: 'Grill butterfly chicken 5-6 min per side. Grill asparagus 3 min. Serve with fresh lemon squeeze.',
    instructions: [
      'Butterfly the chicken breast and season with spices.',
      'Grill chicken for 5-6 minutes on each side.',
      'Grill the asparagus alongside the chicken for 3-4 minutes.',
      'Squeeze lemon juice over chicken and asparagus before serving.'
    ]
  }
];

// GET Exercises Library API
app.get('/api/exercises', (req, res) => {
  const { search, category, difficulty } = req.query;
  let filtered = [...mockExercises];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  }

  if (category) {
    const cat = category.toLowerCase();
    filtered = filtered.filter(e =>
      (e.category && e.category.toLowerCase() === cat) ||
      (e.muscle_name && e.muscle_name.toLowerCase().includes(cat))
    );
  }

  if (difficulty) {
    const diff = difficulty.toLowerCase();
    filtered = filtered.filter(e =>
      e.difficulty && e.difficulty.toLowerCase() === diff
    );
  }

  res.json({
    success: true,
    message: 'Exercises retrieved successfully',
    exercises: filtered
  });
});

// GET Meals Library API
app.get('/api/meals', (req, res) => {
  const { search, goal } = req.query;
  let filtered = [...mockMeals];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.preparation_steps.toLowerCase().includes(q) ||
      (m.ingredients && m.ingredients.some(ing => ing.toLowerCase().includes(q)))
    );
  }

  if (goal) {
    const g = goal.toLowerCase();
    filtered = filtered.filter(m =>
      (m.goal && m.goal.toLowerCase() === g) ||
      (m.meal_type && m.meal_type.toLowerCase() === g)
    );
  }

  // Convert the array into an object with numeric keys for compatibility
  const responseData = {
    success: true,
    message: 'Meals retrieved successfully'
  };

  filtered.forEach((meal, index) => {
    responseData[index.toString()] = meal;
  });

  res.json(responseData);
});
// In‑memory subscription data store
const subscriptionPlans = [
  {
    id: 1,
    name: 'Premium Both',
    description: 'Gym + Diet combo package',
    plan_type: 'both', // diet | gym | both
    price: 199.99
  }
];

const userSubscriptions = []; // { id, userId, planId, planName, amount, status, trainingPlanId, dietPlanId }
const walletTransactions = [];

// Helper to extract user info from headers (simple auth mock)
function getUser(req) {
  const userId = parseInt(req.headers['x-user-id'] || '0', 10);
  const role = req.headers['x-role'] || 'guest';
  return { userId, role };
}

// GET all subscription plans (public)
app.get('/api/subscriptions', (req, res) => {
  res.json({ success: true, subscriptions: subscriptionPlans });
});

app.get('/api/payments/history', (req, res) => {
  const { userId } = getUser(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    success: true,
    balance: user.balance || 0,
    transactions: walletTransactions.filter(tx => tx.userId === userId)
  });
});

app.post('/api/payments/deposit', (req, res) => {
  const { userId } = getUser(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid deposit amount' });

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.balance = (Number(user.balance) || 0) + amount;
  const transaction = {
    id: walletTransactions.length ? walletTransactions[walletTransactions.length - 1].id + 1 : 1,
    userId,
    user_email: user.email,
    description: 'Wallet deposit',
    type: 'deposit',
    amount,
    created_at: new Date()
  };
  walletTransactions.push(transaction);

  res.json({ success: true, balance: user.balance, transaction });
});

// Purchase a subscription plan (any logged‑in user)
app.post('/api/subscriptions/purchase', (req, res) => {
  const { userId, role } = getUser(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });
  const { plan_id, goal, description } = req.body;
  const plan = subscriptionPlans.find(p => p.id === plan_id);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  // Mock user balance handling (assume user object exists in users array)
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.balance < plan.price) return res.status(400).json({ error: 'Insufficient balance' });
  user.balance -= plan.price;
  walletTransactions.push({
    id: walletTransactions.length ? walletTransactions[walletTransactions.length - 1].id + 1 : 1,
    userId,
    user_email: user.email,
    description: `${plan.name} purchase`,
    type: 'purchase',
    amount: Number(plan.price) || 0,
    created_at: new Date()
  });
  const newSub = {
    id: userSubscriptions.length ? userSubscriptions[userSubscriptions.length - 1].id + 1 : 1,
    userId,
    userName: user.name,
    userEmail: user.email,
    planId: plan.id,
    planName: plan.name,
    amount: Number(plan.price) || 0,
    status: 'Pending Assign',
    goal,
    description,
    purchasedAt: new Date(),
    trainingPlanId: plan.plan_type === 'gym' || plan.plan_type === 'both' ? Date.now() + Math.random() : null,
    dietPlanId: plan.plan_type === 'diet' || plan.plan_type === 'both' ? Date.now() + Math.random() : null,
    trainerId: null,
    nutritionistId: null
  };
  userSubscriptions.push(newSub);
  res.json({ success: true, subscription: newSub });
});

// Admin-only dashboard summary
app.get('/api/admin/dashboard', (req, res) => {
  const { role } = getUser(req);
  if (role !== 'admin') return res.status(403).json({ error: 'Admin required' });

  const revenue = userSubscriptions.reduce((total, subscription) => {
    const plan = subscriptionPlans.find(p => p.id === subscription.planId);
    const amount = subscription.amount ?? plan?.price ?? 0;
    return total + (Number(amount) || 0);
  }, 0);

  const activeSubscriptions = userSubscriptions.filter(subscription =>
    ['active', 'pending assign', 'pending'].includes(String(subscription.status).toLowerCase())
  );

  const pendingAssignments = userSubscriptions
    .filter(subscription => String(subscription.status).toLowerCase() === 'pending assign')
    .map(subscription => {
      const plan = subscriptionPlans.find(p => p.id === subscription.planId);
      const planType = plan?.plan_type || 'both';

      return {
        id: subscription.id,
        subscription_id: subscription.id,
        user_id: subscription.userId,
        user_name: subscription.userName || 'Gym Member',
        plan_name: subscription.planName || plan?.name || 'Subscription Plan',
        has_trainer: planType === 'gym' || planType === 'both' ? 1 : 0,
        has_nutritionist: planType === 'diet' || planType === 'both' ? 1 : 0,
        trainer_id: subscription.trainerId,
        nutritionist_id: subscription.nutritionistId
      };
    });

  const transactions = userSubscriptions.map(subscription => ({
    id: subscription.id,
    user_email: subscription.userEmail || 'member@goldfit.local',
    description: `${subscription.planName || 'Subscription'} purchase`,
    type: 'purchase',
    amount: subscription.amount || 0,
    created_at: subscription.purchasedAt
  }));

  res.json({
    revenue,
    active_subscriptions: activeSubscriptions.length,
    equipment_utilization: 0,
    pending_assignments: pendingAssignments,
    transactions
  });
});

// Get current user's subscriptions (any logged‑in user)
app.get('/api/subscriptions/user', (req, res) => {
  const { userId } = getUser(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });
  const subs = userSubscriptions.filter(s => s.userId === userId);
  res.json({ success: true, subscriptions: subs });
});

// Admin: create a new subscription plan
app.post('/api/subscriptions/create', (req, res) => {
  const { role } = getUser(req);
  if (role !== 'admin') return res.status(403).json({ error: 'Admin required' });
  const { name, description, plan_type, price } = req.body;
  if (!['diet', 'gym', 'both'].includes(plan_type)) {
    return res.status(400).json({ error: 'Invalid plan_type' });
  }
  const newPlan = {
    id: subscriptionPlans.length ? subscriptionPlans[subscriptionPlans.length - 1].id + 1 : 1,
    name,
    description,
    plan_type,
    price
  };
  subscriptionPlans.push(newPlan);
  res.json({ success: true, plan: newPlan });
});

// Admin: update an existing subscription plan
app.post('/api/subscriptions/update', (req, res) => {
  const { role } = getUser(req);
  if (role !== 'admin') return res.status(403).json({ error: 'Admin required' });
  const { id, name, description, plan_type, price } = req.body;
  const plan = subscriptionPlans.find(p => p.id === id);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  if (name !== undefined) plan.name = name;
  if (description !== undefined) plan.description = description;
  if (plan_type !== undefined) {
    if (!['diet', 'gym', 'both'].includes(plan_type)) {
      return res.status(400).json({ error: 'Invalid plan_type' });
    }
    plan.plan_type = plan_type;
  }
  if (price !== undefined) plan.price = price;
  res.json({ success: true, plan });
});

// Admin: delete a subscription plan
app.post('/api/subscriptions/delete', (req, res) => {
  const { role } = getUser(req);
  if (role !== 'admin') return res.status(403).json({ error: 'Admin required' });
  const id = req.body.id || req.body.planId;
  const index = subscriptionPlans.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Plan not found' });
  subscriptionPlans.splice(index, 1);
  res.json({ success: true, message: 'Plan deleted' });
});

// AI personalised plan (any logged‑in user) – mock implementation
app.post('/api/subscriptions/ai-plan', async (req, res) => {
  const { userId } = getUser(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });
  const { goal, weight, height, age, gender, body_fat, muscle_mass, water_perc } = req.body;
  // In a real system, forward to AI service at http://localhost:8000
  // Here we return a static mock response
  const mockResponse = {
    calories: 2100,
    protein: 158,
    carbs: 220,
    fat: 65,
    plan: [
      {
        food: 'Chicken Breast',
        servings: 1.5,
        calories: 247.5,
        protein: 46.35,
        carbs: 0,
        fat: 5.4
      }
    ],
    workout_plan: {
      training_days_per_week: 4,
      cardio_minutes_per_week: 150,
      strength_sessions: 3,
      recommended_sets: 4,
      recommended_reps: 12
    }
  };
  res.json({ success: true, data: mockResponse });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
