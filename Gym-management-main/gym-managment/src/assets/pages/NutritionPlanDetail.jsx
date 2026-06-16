import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Apple, Calendar, Info, ArrowLeft, Heart, Flame } from 'lucide-react';
import { getDietMeals } from '../../api/nutritionPlanApi';
import { toast } from 'react-toastify';

function NutritionPlanDetail() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [planName, setPlanName] = useState('Nutrition Program');
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState('Monday');

  const fetchPlanDetails = async () => {
    setLoading(true);
    try {
      const response = await getDietMeals(planId);
      if (response.data) {
        setMeals(response.data.meals || (Array.isArray(response.data) ? response.data : []));
        if (response.data.plan_name) {
          setPlanName(response.data.plan_name);
        }
      }
    } catch (error) {
      console.error('Failed to fetch nutrition plan meals:', error);
      toast.error('Failed to load nutrition plan details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (planId) {
      fetchPlanDetails();
    }
  }, [planId]);

  // Group meals by day_of_week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const groupedMeals = meals.reduce((acc, meal) => {
    const day = meal.day_of_week || 'Monday';
    const cleanDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    if (!acc[cleanDay]) acc[cleanDay] = [];
    acc[cleanDay].push(meal);
    return acc;
  }, {});

  // Set active day to first day with meals
  useEffect(() => {
    const dayWithMeals = daysOfWeek.find(day => groupedMeals[day] && groupedMeals[day].length > 0);
    if (dayWithMeals) {
      setActiveDay(dayWithMeals);
    }
  }, [meals]);

  const activeMeals = groupedMeals[activeDay] || [];

  // Calculate day totals
  const totalCalories = activeMeals.reduce((sum, meal) => sum + (parseFloat(meal.calories) || 0), 0);
  const totalProtein = activeMeals.reduce((sum, meal) => sum + (parseFloat(meal.protein) || 0), 0);
  const totalCarbs = activeMeals.reduce((sum, meal) => sum + (parseFloat(meal.carbs) || 0), 0);
  const totalFat = activeMeals.reduce((sum, meal) => sum + (parseFloat(meal.fat) || 0), 0);

  return (
    <div className="profile-container text-white py-5 px-3 min-vh-100" style={{ background: '#0a0a0a' }}>
      <div className="max-width-lg mx-auto" style={{ maxWidth: '950px' }}>
        
        <div className="d-flex align-items-center gap-3 mb-5 border-bottom border-secondary border-opacity-15 pb-4">
          <button
            onClick={() => navigate('/my-subscriptions')}
            className="btn btn-link text-white p-0 d-flex align-items-center justify-content-center"
            style={{ textDecoration: 'none' }}
          >
            <ArrowLeft size={24} className="text-warning hover-lift" />
          </button>
          <div>
            <h1 className="fw-black text-gradient display-6 mb-1">{planName}</h1>
            <p className="text-secondary small m-0">Structured macro planning, meals list, and nutritionist recommendations.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading plan...</span>
            </div>
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-5 rounded-4" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Apple size={40} className="text-secondary mb-3 opacity-40" />
            <p className="text-secondary small">No meals assigned to this plan yet. Check back soon!</p>
          </div>
        ) : (
          <div>
            {/* Day Selector Tabs */}
            <div className="d-flex gap-2 overflow-auto pb-3 mb-4 scrollbar-hidden" style={{ whiteSpace: 'nowrap' }}>
              {daysOfWeek.map((day) => {
                const count = groupedMeals[day]?.length || 0;
                const isSelected = activeDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className="btn px-4 py-2 fw-bold text-uppercase d-flex align-items-center gap-2 hover-lift"
                    style={{
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      background: isSelected 
                        ? 'linear-gradient(135deg, #ff7a00 0%, #ff4400 100%)' 
                        : count > 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                      color: isSelected ? '#000' : count > 0 ? '#fff' : '#666',
                      border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                      fontWeight: 800,
                      opacity: count > 0 || isSelected ? 1 : 0.4
                    }}
                  >
                    {day}
                    {count > 0 && (
                      <span 
                        className="badge rounded-circle d-flex align-items-center justify-content-center" 
                        style={{ 
                          width: '18px', 
                          height: '18px', 
                          background: isSelected ? 'rgba(0,0,0,0.2)' : 'rgba(255,122,0,0.2)',
                          color: isSelected ? '#000' : '#ff7a00',
                          fontSize: '0.6rem',
                          padding: 0
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Day Macro Summary Card */}
            {activeMeals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="row g-3 mb-4 p-4 rounded-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(20,20,20,0.85) 0%, rgba(10,10,10,0.9) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div className="col-12 border-bottom border-secondary border-opacity-15 pb-2 mb-2">
                  <h5 className="small text-secondary text-uppercase fw-bold m-0" style={{ letterSpacing: '1px' }}>
                    {activeDay} Macro Totals
                  </h5>
                </div>
                <div className="col-6 col-md-3">
                  <span className="profile-detail-label text-warning small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Total Energy</span>
                  <span className="fs-4 fw-black text-white">{Math.round(totalCalories)} <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>kcal</span></span>
                </div>
                <div className="col-6 col-md-3">
                  <span className="profile-detail-label text-danger small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Protein</span>
                  <span className="fs-4 fw-black text-white">{Math.round(totalProtein)}<span className="small text-secondary" style={{ fontSize: '0.75rem' }}>g</span></span>
                </div>
                <div className="col-6 col-md-3">
                  <span className="profile-detail-label text-info small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Carbohydrates</span>
                  <span className="fs-4 fw-black text-white">{Math.round(totalCarbs)}<span className="small text-secondary" style={{ fontSize: '0.75rem' }}>g</span></span>
                </div>
                <div className="col-6 col-md-3">
                  <span className="profile-detail-label text-success small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Fats</span>
                  <span className="fs-4 fw-black text-white">{Math.round(totalFat)}<span className="small text-secondary" style={{ fontSize: '0.75rem' }}>g</span></span>
                </div>
              </motion.div>
            )}

            {/* Meals List */}
            {activeMeals.length === 0 ? (
              <div className="text-center py-5 rounded-4" style={{ background: 'rgba(20, 20, 20, 0.3)', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <span className="text-secondary small">No meals scheduled for this day. Enjoy your nutrition targets!</span>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {activeMeals.map((meal, idx) => (
                  <motion.div
                    key={meal.id || idx}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="p-4"
                    style={{
                      background: 'rgba(20, 20, 20, 0.75)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
                    }}
                  >
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-3 bg-black bg-opacity-40 rounded-3 border border-secondary border-opacity-10 text-info">
                          <Apple size={24} />
                        </div>
                        <div>
                          <h4 className="fw-black text-white m-0 fs-5">{meal.meal_name || 'Diet Meal'}</h4>
                          <span className="text-secondary small d-block mt-1">Scheduled: {meal.time_slot || meal.slot || 'Throughout Day'}</span>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <div 
                          className="px-3 py-2 rounded-3 text-center" 
                          style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                        >
                          <span className="text-secondary small d-block" style={{ fontSize: '0.6rem' }}>Calories</span>
                          <span className="text-warning fw-black fs-6">{Math.round(meal.calories) || 0} kcal</span>
                        </div>
                        <div 
                          className="px-3 py-2 rounded-3 text-center" 
                          style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                        >
                          <span className="text-secondary small d-block" style={{ fontSize: '0.6rem' }}>P / C / F</span>
                          <span className="text-white fw-bold" style={{ fontSize: '0.8rem' }}>
                            <span className="text-danger">{Math.round(meal.protein) || 0}g</span>
                            <span className="opacity-25 mx-1">|</span>
                            <span className="text-info">{Math.round(meal.carbs) || 0}g</span>
                            <span className="opacity-25 mx-1">|</span>
                            <span className="text-success">{Math.round(meal.fat) || 0}g</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {meal.instructions && (
                      <div className="mt-3 p-3 rounded-3 bg-black bg-opacity-30 border border-secondary border-opacity-10 d-flex gap-2 align-items-start">
                        <Info size={16} className="text-info flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-secondary small d-block fw-bold text-uppercase mb-1" style={{ fontSize: '0.6rem' }}>Ingredients / Prep</span>
                          <p className="text-secondary small m-0" style={{ lineHeight: '1.5' }}>{meal.instructions}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NutritionPlanDetail;
