import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Calendar, Info, ArrowLeft, RefreshCw } from 'lucide-react';
import { getWorkoutExercises } from '../../api/trainingPlanApi';
import { toast } from 'react-toastify';

function TrainingPlanDetail() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [planName, setPlanName] = useState('Training Program');
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState('Monday');

  const fetchPlanDetails = async () => {
    setLoading(true);
    try {
      const response = await getWorkoutExercises(planId);
      if (response.data) {
        setExercises(response.data.exercises || (Array.isArray(response.data) ? response.data : []));
        if (response.data.plan_name) {
          setPlanName(response.data.plan_name);
        }
      }
    } catch (error) {
      console.error('Failed to fetch training plan exercises:', error);
      toast.error('Failed to load training plan details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (planId) {
      fetchPlanDetails();
    }
  }, [planId]);

  // Group exercises by day_of_week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const groupedExercises = exercises.reduce((acc, exercise) => {
    // Standardize day name
    const day = exercise.day_of_week || 'Monday';
    const cleanDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    if (!acc[cleanDay]) acc[cleanDay] = [];
    acc[cleanDay].push(exercise);
    return acc;
  }, {});

  // Set active day to the first day that has exercises, if any
  useEffect(() => {
    const dayWithExercises = daysOfWeek.find(day => groupedExercises[day] && groupedExercises[day].length > 0);
    if (dayWithExercises) {
      setActiveDay(dayWithExercises);
    }
  }, [exercises]);

  const activeExercises = groupedExercises[activeDay] || [];

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
            <p className="text-secondary small m-0">Assigned workouts, sets, and instruction logs.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading plan...</span>
            </div>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-5 rounded-4" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Dumbbell size={40} className="text-secondary mb-3 opacity-40" />
            <p className="text-secondary small">No exercises assigned to this plan yet. Check back soon!</p>
          </div>
        ) : (
          <div>
            {/* Day Selector Tabs */}
            <div className="d-flex gap-2 overflow-auto pb-3 mb-4 scrollbar-hidden" style={{ whiteSpace: 'nowrap' }}>
              {daysOfWeek.map((day) => {
                const count = groupedExercises[day]?.length || 0;
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

            {/* Exercise List */}
            {activeExercises.length === 0 ? (
              <div className="text-center py-5 rounded-4" style={{ background: 'rgba(20, 20, 20, 0.3)', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <span className="text-secondary small">Rest Day. Give your muscles time to recover! 💤</span>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {activeExercises.map((ex, idx) => (
                  <motion.div
                    key={ex.id || idx}
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
                        <div className="p-3 bg-black bg-opacity-40 rounded-3 border border-secondary border-opacity-10 text-warning">
                          <Dumbbell size={24} />
                        </div>
                        <div>
                          <h4 className="fw-black text-white m-0 fs-5">{ex.exercise_name || 'Workout Exercise'}</h4>
                          <span className="text-secondary small d-block mt-1">Target muscle group & movement</span>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <div 
                          className="px-3 py-2 rounded-3 text-center" 
                          style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                        >
                          <span className="text-secondary small d-block" style={{ fontSize: '0.6rem' }}>Sets</span>
                          <span className="text-white fw-black fs-6">{ex.sets || 3}</span>
                        </div>
                        <div 
                          className="px-3 py-2 rounded-3 text-center" 
                          style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                        >
                          <span className="text-secondary small d-block" style={{ fontSize: '0.6rem' }}>Reps</span>
                          <span className="text-white fw-black fs-6">{ex.reps || 12}</span>
                        </div>
                        {ex.duration_minutes && (
                          <div 
                            className="px-3 py-2 rounded-3 text-center" 
                            style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                          >
                            <span className="text-secondary small d-block" style={{ fontSize: '0.6rem' }}>Duration</span>
                            <span className="text-warning fw-black fs-6">{ex.duration_minutes}m</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {ex.instructions && (
                      <div className="mt-3 p-3 rounded-3 bg-black bg-opacity-30 border border-secondary border-opacity-10 d-flex gap-2 align-items-start">
                        <Info size={16} className="text-info flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-secondary small d-block fw-bold text-uppercase mb-1" style={{ fontSize: '0.6rem' }}>Instructions</span>
                          <p className="text-secondary small m-0" style={{ lineHeight: '1.5' }}>{ex.instructions}</p>
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

export default TrainingPlanDetail;
