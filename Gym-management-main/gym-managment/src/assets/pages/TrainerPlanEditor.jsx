import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Save, Plus, Trash2, ArrowLeft, Calendar, Info } from 'lucide-react';
import { getWorkoutExercises } from '../../api/trainingPlanApi';
import { addExercisesToPlan } from '../../api/specialistApi';
import { toast } from 'react-toastify';

function TrainerPlanEditor() {
  const { planId } = useParams();
  const navigate = useNavigate();
  
  const [exercises, setExercises] = useState([]);
  const [planName, setPlanName] = useState('Training Plan');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    exercise_name: '',
    sets: '3',
    reps: '12',
    day_of_week: 'Monday',
    instructions: '',
    duration_minutes: '45'
  });

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const res = await getWorkoutExercises(planId);
      if (res.data) {
        setExercises(res.data.exercises || (Array.isArray(res.data) ? res.data : []));
        if (res.data.plan_name) setPlanName(res.data.plan_name);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load current exercise split.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (planId) {
      fetchExercises();
    }
  }, [planId]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddLocalExercise = (e) => {
    e.preventDefault();
    if (!form.exercise_name.trim()) {
      toast.error('Exercise name cannot be empty.');
      return;
    }

    const newEx = {
      exercise_name: form.exercise_name,
      sets: parseInt(form.sets) || 3,
      reps: parseInt(form.reps) || 12,
      day_of_week: form.day_of_week,
      instructions: form.instructions,
      duration_minutes: parseInt(form.duration_minutes) || 45
    };

    setExercises([...exercises, newEx]);
    setForm({
      exercise_name: '',
      sets: '3',
      reps: '12',
      day_of_week: form.day_of_week, // preserve current day selection
      instructions: '',
      duration_minutes: '45'
    });
    toast.success('Exercise added to split below!');
  };

  const handleRemoveLocalExercise = (index) => {
    const updated = exercises.filter((_, idx) => idx !== index);
    setExercises(updated);
    toast.info('Exercise removed from split.');
  };

  const handlePublishPlan = async () => {
    setSubmitLoading(true);
    try {
      const res = await addExercisesToPlan(parseInt(planId), exercises);
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Training program published successfully!');
        navigate('/specialist/dashboard');
      } else {
        toast.error(res.data?.message || 'Failed to publish program.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Uplink failed during publication.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
            <h1 className="fw-black text-gradient display-6 mb-1" style={{ fontWeight: 900 }}>Workout Planner</h1>
            <p className="text-secondary small m-0">Build, modify, and publish the dynamic workout splits for Program #{planId}.</p>
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
                  Assign Workout
                </h3>
                
                <form onSubmit={handleAddLocalExercise} className="d-flex flex-column gap-3">
                  <div className="form-group">
                    <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Exercise Name</label>
                    <input
                      type="text"
                      name="exercise_name"
                      value={form.exercise_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Incline Barbell Press"
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
                      <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Duration (Mins)</label>
                      <input
                        type="number"
                        name="duration_minutes"
                        value={form.duration_minutes}
                        onChange={handleInputChange}
                        className="form-control text-white bg-black bg-opacity-40 border border-secondary border-opacity-25 py-2"
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Sets</label>
                      <input
                        type="number"
                        name="sets"
                        value={form.sets}
                        onChange={handleInputChange}
                        className="form-control text-white bg-black bg-opacity-40 border border-secondary border-opacity-25 py-2"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Reps</label>
                      <input
                        type="number"
                        name="reps"
                        value={form.reps}
                        onChange={handleInputChange}
                        className="form-control text-white bg-black bg-opacity-40 border border-secondary border-opacity-25 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Instructions</label>
                    <textarea
                      name="instructions"
                      value={form.instructions}
                      onChange={handleInputChange}
                      placeholder="e.g. Focus on tempo, slow eccentric drop and strong contraction at the top."
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
                    <Plus size={18} /> Queue Exercise
                  </button>
                </form>
              </div>

              <div className="mt-4 pt-4 border-top border-secondary border-opacity-15">
                <button
                  onClick={handlePublishPlan}
                  disabled={submitLoading || exercises.length === 0}
                  className="btn btn-outline-warning w-100 py-3 fw-black text-uppercase d-flex align-items-center justify-content-center gap-2 hover-lift"
                  style={{
                    borderRadius: '10px',
                    border: '2px solid var(--accent-primary)',
                    fontWeight: 900,
                    letterSpacing: '1px'
                  }}
                >
                  <Save size={18} /> {submitLoading ? 'Publishing...' : 'Publish Workout Program'}
                </button>
              </div>
            </div>
          </div>

          {/* Current Program Split List (Right Pane) */}
          <div className="col-12 col-lg-7">
            <h3 className="fw-black text-white mb-4 fs-5 text-uppercase d-flex align-items-center gap-2" style={{ letterSpacing: '1px' }}>
              <Dumbbell size={18} className="text-warning" /> Queued Workout splits
            </h3>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
              </div>
            ) : exercises.length === 0 ? (
              <div className="text-center py-5 rounded-4" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span className="text-secondary small">No exercises currently in plan. Add exercises using the form on the left.</span>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {exercises.map((ex, idx) => (
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
                        <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 rounded px-2.5 py-1 fw-bold small text-uppercase mb-2" style={{ fontSize: '0.6rem' }}>
                          {ex.day_of_week}
                        </span>
                        <h4 className="fw-black text-white m-0 fs-6">{ex.exercise_name}</h4>
                        <div className="d-flex gap-3 text-secondary small mt-2" style={{ fontSize: '0.75rem' }}>
                          <span>Sets: <strong className="text-white">{ex.sets}</strong></span>
                          <span>Reps: <strong className="text-white">{ex.reps}</strong></span>
                          {ex.duration_minutes && <span>Duration: <strong className="text-white">{ex.duration_minutes}m</strong></span>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveLocalExercise(idx)}
                        className="btn btn-link text-danger p-2 hover-lift"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {ex.instructions && (
                      <div className="mt-2.5 p-2 bg-black bg-opacity-20 rounded border border-secondary border-opacity-10 d-flex gap-1.5 align-items-start">
                        <Info size={12} className="text-info mt-0.5" />
                        <p className="text-secondary small m-0" style={{ fontSize: '0.7rem', lineHeight: '1.4' }}>{ex.instructions}</p>
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

export default TrainerPlanEditor;
