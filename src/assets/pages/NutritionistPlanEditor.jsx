import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Apple, Save, Plus, Trash2, ArrowLeft, Calendar, Info } from 'lucide-react';
import { getDietMeals } from '../../api/nutritionPlanApi';
import { addMealsToPlan } from '../../api/specialistApi';
import { toast } from 'react-toastify';

function NutritionistPlanEditor() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [planName, setPlanName] = useState('Nutrition Program');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    meal_name: '',
    day_of_week: 'Monday',
    time_slot: 'Breakfast',
    calories: '400',
    protein: '30',
    carbs: '40',
    fat: '12',
    instructions: ''
  });

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const res = await getDietMeals(planId);
      if (res.data) {
        setMeals(res.data.meals || (Array.isArray(res.data) ? res.data : []));
        if (res.data.plan_name) setPlanName(res.data.plan_name);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load current diet split.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (planId) {
      fetchMeals();
    }
  }, [planId]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddLocalMeal = (e) => {
    e.preventDefault();
    if (!form.meal_name.trim()) {
      toast.error('Meal name cannot be empty.');
      return;
    }

    const newMeal = {
      meal_name: form.meal_name,
      day_of_week: form.day_of_week,
      time_slot: form.time_slot,
      calories: parseFloat(form.calories) || 0,
      protein: parseFloat(form.protein) || 0,
      carbs: parseFloat(form.carbs) || 0,
      fat: parseFloat(form.fat) || 0,
      instructions: form.instructions
    };

    setMeals([...meals, newMeal]);
    setForm({
      meal_name: '',
      day_of_week: form.day_of_week,
      time_slot: 'Breakfast',
      calories: '400',
      protein: '30',
      carbs: '40',
      fat: '12',
      instructions: ''
    });
    toast.success('Meal added to split below!');
  };

  const handleRemoveLocalMeal = (index) => {
    const updated = meals.filter((_, idx) => idx !== index);
    setMeals(updated);
    toast.info('Meal removed from split.');
  };

  const handlePublishPlan = async () => {
    setSubmitLoading(true);
    try {
      const res = await addMealsToPlan(parseInt(planId), meals);
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Nutrition program published successfully!');
        navigate('/specialist/dashboard');
      } else {
        toast.error(res.data?.error || res.data?.message || 'Failed to publish program.');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Uplink failed during publication.'
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Late Night Snack'];

  return (
    <div className="profile-container text-white py-5 px-3 min-vh-100" style={{ background: '#0a0a0a' }}>
      <div className="max-width-lg mx-auto" style={{ maxWidth: '1050px' }}>

        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-5 border-bottom border-secondary border-opacity-15 pb-4">
          <button
            onClick={() => navigate('/specialist/dashboard')}
            className="btn btn-link text-white p-0 d-flex align-items-center justify-content-center"
            style={{ textDecoration: 'none' }}
          >
            <ArrowLeft size={24} className="text-warning hover-lift" />
          </button>
          <div>
            <h1 className="fw-black text-gradient display-6 mb-1" style={{ fontWeight: 900 }}>Nutrition Planner</h1>
            <p className="text-secondary small m-0">Build, modify, and publish the dynamic diet programs for Program #{planId}.</p>
          </div>
        </div>

        <div className="row g-4">
          {/* Builder Form (Left Pane) */}
          <div className="col-12 col-lg-5">
            <div 
              className="p-4 h-100 d-flex flex-column justify-content-between"
              style={{
                background: 'rgba(20, 20, 20, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
              }}
            >
              <div>
                <h3 className="fw-black text-warning mb-4 fs-5 text-uppercase" style={{ letterSpacing: '1px' }}>
                  Assign Meal
                </h3>

                <form onSubmit={handleAddLocalMeal} className="d-flex flex-column gap-3">
                  <div className="form-group">
                    <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Meal Description</label>
                    <input
                      type="text"
                      name="meal_name"
                      value={form.meal_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Grilled Chicken with Quinoa"
                      className="form-control text-white bg-black bg-opacity-40 border border-secondary border-opacity-25 py-2"
                      required
                    />
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Day</label>
                      <select
                        name="day_of_week"
                        value={form.day_of_week}
                        onChange={handleInputChange}
                        className="form-control text-white bg-black bg-opacity-40 border border-secondary border-opacity-25 py-2"
                      >
                        {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Timing</label>
                      <select
                        name="time_slot"
                        value={form.time_slot}
                        onChange={handleInputChange}
                        className="form-control text-white bg-black bg-opacity-40 border border-secondary border-opacity-25 py-2"
                      >
                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Energy (kcal)</label>
                      <input
                        type="number"
                        name="calories"
                        value={form.calories}
                        onChange={handleInputChange}
                        className="form-control text-white bg-black bg-opacity-40 border border-secondary border-opacity-25 py-2"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Protein (g)</label>
                      <input
                        type="number"
                        name="protein"
                        value={form.protein}
                        onChange={handleInputChange}
                        className="form-control text-white bg-black bg-opacity-40 border border-secondary border-opacity-25 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Carbohydrates (g)</label>
                      <input
                        type="number"
                        name="carbs"
                        value={form.carbs}
                        onChange={handleInputChange}
                        className="form-control text-white bg-black bg-opacity-40 border border-secondary border-opacity-25 py-2"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Fats (g)</label>
                      <input
                        type="number"
                        name="fat"
                        value={form.fat}
                        onChange={handleInputChange}
                        className="form-control text-white bg-black bg-opacity-40 border border-secondary border-opacity-25 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Cooking Instructions / Notes</label>
                    <textarea
                      name="instructions"
                      value={form.instructions}
                      onChange={handleInputChange}
                      placeholder="e.g. 150g grilled breast, 1 cup steamed white quinoa, side spinach salad."
                      className="form-control text-white bg-black bg-opacity-40 border border-secondary border-opacity-25"
                      rows="3"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-warning mt-3 py-2.5 fw-black text-uppercase d-flex align-items-center justify-content-center gap-2 hover-lift"
                    style={{
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #ff7a00 0%, #ff4400 100%)',
                      border: 'none',
                      color: '#000',
                      fontWeight: 800
                    }}
                  >
                    <Plus size={18} /> Queue Meal
                  </button>
                </form>
              </div>

              <div className="mt-4 pt-4 border-top border-secondary border-opacity-15">
                <button
                  onClick={handlePublishPlan}
                  disabled={submitLoading || meals.length === 0}
                  className="btn btn-outline-info w-100 py-3 fw-black text-uppercase d-flex align-items-center justify-content-center gap-2 hover-lift"
                  style={{
                    borderRadius: '10px',
                    border: '2px solid var(--accent-secondary)',
                    fontWeight: 900,
                    letterSpacing: '1px'
                  }}
                >
                  <Save size={18} /> {submitLoading ? 'Publishing...' : 'Publish Nutrition Program'}
                </button>
              </div>
            </div>
          </div>

          {/* Current Program Split List (Right Pane) */}
          <div className="col-12 col-lg-7">
            <h3 className="fw-black text-white mb-4 fs-5 text-uppercase d-flex align-items-center gap-2" style={{ letterSpacing: '1px' }}>
              <Apple size={18} className="text-info" /> Queued Diet meals
            </h3>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
              </div>
            ) : meals.length === 0 ? (
              <div className="text-center py-5 rounded-4" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span className="text-secondary small">No meals currently in plan. Add meals using the form on the left.</span>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {meals.map((meal, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3"
                    style={{
                      background: 'rgba(25, 25, 25, 0.45)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="d-flex gap-2 mb-2">
                          <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 rounded px-2 py-0.5 fw-bold small text-uppercase" style={{ fontSize: '0.6rem' }}>
                            {meal.day_of_week}
                          </span>
                          <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded px-2 py-0.5 fw-bold small text-uppercase" style={{ fontSize: '0.6rem' }}>
                            {meal.time_slot}
                          </span>
                        </div>
                        <h4 className="fw-black text-white m-0 fs-6">{meal.meal_name}</h4>
                        <div className="d-flex gap-3 text-secondary small mt-2" style={{ fontSize: '0.75rem' }}>
                          <span>Energy: <strong className="text-white">{meal.calories} kcal</strong></span>
                          <span>Macros: <strong className="text-white">{meal.protein}g P / {meal.carbs}g C / {meal.fat}g F</strong></span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveLocalMeal(idx)}
                        className="btn btn-link text-danger p-2 hover-lift"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {meal.instructions && (
                      <div className="mt-2.5 p-2 bg-black bg-opacity-20 rounded border border-secondary border-opacity-10 d-flex gap-1.5 align-items-start">
                        <Info size={12} className="text-info mt-0.5" />
                        <p className="text-secondary small m-0" style={{ fontSize: '0.7rem', lineHeight: '1.4' }}>{meal.instructions}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default NutritionistPlanEditor;
