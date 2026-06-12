import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Activity, Phone, CreditCard, Cpu, Sparkles, AlertTriangle, RefreshCw, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [actionLoading, setActionLoading] = useState(false);

  // AI Plan states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState(() => {
    const saved = localStorage.getItem(`goldfit_ai_plan_${user?.id}`);
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showAiForm, setShowAiForm] = useState(false);
  const [aiForm, setAiForm] = useState({
    goal: 'Weight Loss',
    weight: '',
    height: '',
    age: user?.age || '',
    gender: user?.gender || 'male',
    body_fat: '',
    muscle_mass: '',
    water_perc: ''
  });
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (user) {
      setAiForm(prev => ({
        ...prev,
        age: prev.age || user.age || '',
        gender: prev.gender || user.gender || 'male'
      }));
    }
  }, [user]);

  const handleAiFormChange = (e) => {
    setAiForm({ ...aiForm, [e.target.name]: e.target.value });
  };

  const handleGenerateAiPlan = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError('');
    try {
      const payload = {
        goal: aiForm.goal,
        weight: parseFloat(aiForm.weight),
        height: parseFloat(aiForm.height),
        age: parseInt(aiForm.age),
        gender: aiForm.gender,
        body_fat: parseFloat(aiForm.body_fat),
        muscle_mass: parseFloat(aiForm.muscle_mass),
        water_perc: parseFloat(aiForm.water_perc)
      };

      const response = await axios.post('/api/subscriptions/ai-plan', payload);
      const planData = response.data;
      setAiPlan(planData);
      localStorage.setItem(`goldfit_ai_plan_${user.id}`, JSON.stringify(planData));
      setShowAiForm(false);
    } catch (err) {
      console.error('Error generating AI plan:', err);
      setAiError(err.response?.data?.message || err.response?.data?.error || 'Uplink to AI service failed. Please make sure the service is online.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleResetAiPlan = () => {
    if (confirm("Are you sure you want to regenerate your AI Plan? This will overwrite the current one.")) {
      setAiPlan(null);
      localStorage.removeItem(`goldfit_ai_plan_${user.id}`);
      setShowAiForm(true);
    }
  };

  const renderAiPlanContent = () => {
    if (!aiPlan) return null;
    
    // Support structured plan array from the API response
    if (aiPlan.plan && Array.isArray(aiPlan.plan)) {
      return (
        <div className="ai-structured-plan text-start">
          <div className="row g-3 mb-4 text-center">
            <div className="col-6 col-md-3">
              <div className="p-3 rounded border border-warning border-opacity-10 bg-black bg-opacity-25" style={{ boxShadow: '0 0 10px rgba(255, 122, 0, 0.05)' }}>
                <span className="profile-detail-label text-warning small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Calories</span>
                <span className="fs-5 fw-black text-white">{aiPlan.calories || 0} <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>kcal</span></span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 rounded border border-danger border-opacity-10 bg-black bg-opacity-25" style={{ boxShadow: '0 0 10px rgba(255, 68, 68, 0.05)' }}>
                <span className="profile-detail-label text-danger small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Protein</span>
                <span className="fs-5 fw-black text-white">{aiPlan.protein || 0}<span className="small text-secondary" style={{ fontSize: '0.75rem' }}>g</span></span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 rounded border border-info border-opacity-10 bg-black bg-opacity-25" style={{ boxShadow: '0 0 10px rgba(0, 191, 255, 0.05)' }}>
                <span className="profile-detail-label text-info small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Carbohydrates</span>
                <span className="fs-5 fw-black text-white">{aiPlan.carbs || 0}<span className="small text-secondary" style={{ fontSize: '0.75rem' }}>g</span></span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 rounded border border-success border-opacity-10 bg-black bg-opacity-25" style={{ boxShadow: '0 0 10px rgba(0, 230, 115, 0.05)' }}>
                <span className="profile-detail-label text-success small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Fats</span>
                <span className="fs-5 fw-black text-white">{aiPlan.fat || 0}<span className="small text-secondary" style={{ fontSize: '0.75rem' }}>g</span></span>
              </div>
            </div>
          </div>

          {aiPlan.workout_plan && typeof aiPlan.workout_plan === 'object' && (
            <>
              <h5 className="text-info text-uppercase fw-black mb-3 small d-flex align-items-center gap-2" style={{ letterSpacing: '1px' }}>
                💪 Synthesized Training Protocol
              </h5>
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-4">
                  <div className="p-3 rounded border border-info border-opacity-10 bg-black bg-opacity-25" style={{ boxShadow: '0 0 10px rgba(0, 191, 255, 0.05)' }}>
                    <span className="profile-detail-label text-info small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Training Days</span>
                    <span className="fs-5 fw-black text-white">{aiPlan.workout_plan.training_days_per_week || 0} <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>per week</span></span>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="p-3 rounded border border-info border-opacity-10 bg-black bg-opacity-25" style={{ boxShadow: '0 0 10px rgba(0, 191, 255, 0.05)' }}>
                    <span className="profile-detail-label text-info small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Strength Sessions</span>
                    <span className="fs-5 fw-black text-white">{aiPlan.workout_plan.strength_sessions || 0} <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>sessions</span></span>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="p-3 rounded border border-info border-opacity-10 bg-black bg-opacity-25" style={{ boxShadow: '0 0 10px rgba(0, 191, 255, 0.05)' }}>
                    <span className="profile-detail-label text-info small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Cardio</span>
                    <span className="fs-5 fw-black text-white">{aiPlan.workout_plan.cardio_minutes_per_week || 0} <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>min/week</span></span>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="p-3 rounded border border-warning border-opacity-10 bg-black bg-opacity-25" style={{ boxShadow: '0 0 10px rgba(255, 122, 0, 0.05)' }}>
                    <span className="profile-detail-label text-warning small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Sets</span>
                    <span className="fs-5 fw-black text-white">{aiPlan.workout_plan.recommended_sets || 0} <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>per exercise</span></span>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="p-3 rounded border border-warning border-opacity-10 bg-black bg-opacity-25" style={{ boxShadow: '0 0 10px rgba(255, 122, 0, 0.05)' }}>
                    <span className="profile-detail-label text-warning small d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Reps</span>
                    <span className="fs-5 fw-black text-white">{aiPlan.workout_plan.recommended_reps || 0} <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>reps</span></span>
                  </div>
                </div>
              </div>
            </>
          )}

          <h5 className="text-warning text-uppercase fw-black mb-3 small d-flex align-items-center gap-2" style={{ letterSpacing: '1px' }}>
            <Activity size={16} /> Synthesized Dietary Protocol
          </h5>

          <div className="table-responsive">
            <table className="table table-dark table-hover border border-secondary border-opacity-10 align-middle small mb-0 rounded overflow-hidden">
              <thead>
                <tr className="border-bottom border-secondary border-opacity-25">
                  <th className="text-secondary text-uppercase fw-bold" style={{ fontSize: '0.65rem', padding: '12px' }}>Food Source</th>
                  <th className="text-secondary text-uppercase fw-bold text-center" style={{ fontSize: '0.65rem', padding: '12px' }}>Servings</th>
                  <th className="text-secondary text-uppercase fw-bold text-center" style={{ fontSize: '0.65rem', padding: '12px' }}>Energy</th>
                  <th className="text-secondary text-uppercase fw-bold text-center" style={{ fontSize: '0.65rem', padding: '12px' }}>Macros (P / C / F)</th>
                </tr>
              </thead>
              <tbody>
                {aiPlan.plan.map((item, index) => (
                  <tr key={index} className="border-bottom border-secondary border-opacity-10">
                    <td className="text-white fw-bold text-capitalize" style={{ padding: '12px' }}>{item.food}</td>
                    <td className="text-secondary text-center" style={{ padding: '12px' }}>{item.servings} x</td>
                    <td className="text-warning text-center fw-bold" style={{ padding: '12px' }}>{Math.round(item.calories)} kcal</td>
                    <td className="text-info text-center fw-bold" style={{ padding: '12px' }}>
                      <span className="text-danger">{Math.round(item.protein)}g</span>
                      <span className="text-white opacity-25 mx-1">|</span>
                      <span className="text-info">{Math.round(item.carbs)}g</span>
                      <span className="text-white opacity-25 mx-1">|</span>
                      <span className="text-success">{Math.round(item.fat)}g</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    // Fallback: If it's a raw string or plan is string
    let text = "";
    if (typeof aiPlan === 'string') {
      text = aiPlan;
    } else if (aiPlan.plan && typeof aiPlan.plan === 'string') {
      text = aiPlan.plan;
    } else if (aiPlan.workout_plan || aiPlan.nutrition_plan) {
      text = `### WORKOUT PLAN\n${aiPlan.workout_plan || ''}\n\n### NUTRITION PLAN\n${aiPlan.nutrition_plan || ''}`;
    } else {
      text = JSON.stringify(aiPlan, null, 2);
    }

    return text.split('\n').map((line, index) => {
      if (line.startsWith('###')) {
        return <h5 key={index} className="text-warning mt-3 mb-2 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{line.replace('###', '').trim()}</h5>;
      }
      if (line.startsWith('##')) {
        return <h4 key={index} className="text-gradient mt-4 mb-3 fw-black text-uppercase">{line.replace('##', '').trim()}</h4>;
      }
      if (line.startsWith('#')) {
        return <h3 key={index} className="text-gradient mt-4 mb-3 fw-black text-uppercase border-bottom pb-2 border-secondary border-opacity-25">{line.replace('#', '').trim()}</h3>;
      }
      if (line.startsWith('*') || line.startsWith('-')) {
        return <li key={index} className="text-white small mb-1 ms-3" style={{ listStyleType: 'square', opacity: 0.9 }}>{line.substring(1).trim()}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      const boldParts = [];
      const boldRegex = /\*\*(.*?)\*\*/g;
      let lastIdx = 0;
      let match;
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIdx) {
          boldParts.push(line.substring(lastIdx, match.index));
        }
        boldParts.push(<strong key={match.index} className="text-warning">{match[1]}</strong>);
        lastIdx = boldRegex.lastIndex;
      }
      if (lastIdx < line.length) {
        boldParts.push(line.substring(lastIdx));
      }

      if (boldParts.length > 0) {
        return (
          <p key={index} className="text-white small mb-2" style={{ lineHeight: '1.6', opacity: 0.85 }}>
            {boldParts}
          </p>
        );
      }

      return <p key={index} className="text-white small mb-2" style={{ lineHeight: '1.6', opacity: 0.85 }}>{line}</p>;
    });
  };

  const handleFundWallet = async () => {
    const amount = prompt("Enter amount to fund ($):", "50");
    if (!amount || isNaN(amount)) return;
    
    setActionLoading(true);
    try {
      const response = await axios.post('/api/wallet/fund', { amount: parseFloat(amount) });
      if (response.data.success) {
        alert(`Successfully added $${amount} to your wallet!`);
        refreshUser(); // Update balance in UI
      }
    } catch (e) {
      alert(e.response?.data?.message || "Failed to fund wallet.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuySubscription = async (planId, planName) => {
    if (!confirm(`Confirm purchase of ${planName}?`)) return;
    
    setActionLoading(true);
    try {
      const response = await axios.post('/api/subscriptions/purchase', { planId });
      if (response.data.success) {
        alert(`${planName} Activated! Your journey starts now.`);
        refreshUser();
      }
    } catch (e) {
      alert(e.response?.data?.message || "Purchase failed. Check balance.");
    } finally {
      setActionLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container text-white d-flex align-items-center justify-content-center">
        <div className="text-center" style={{ zIndex: 1 }}>
          <h3 className="text-warning text-uppercase mb-3">Profile unavailable</h3>
          <p className="text-secondary mb-3">Please sign in to access your profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="btn-neon-logout"
            style={{ maxWidth: 240 }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="profile-card"
      >
        <div className="text-center mb-4">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              <User size={50} className="profile-avatar-icon" />
            </div>
          </div>
          <h2 className="profile-name">{user.name}</h2>
          <div className="mt-2 d-flex justify-content-center gap-2">
            <button 
              onClick={() => navigate('/profile/edit')} 
              className="btn btn-sm btn-outline-warning py-1.5 px-3 rounded-pill fw-bold text-uppercase" 
              style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
            >
              Edit Profile
            </button>
          </div>
          <div className="mt-3">
            <span className="profile-badge">
              {user.role} Status
            </span>
          </div>
        </div>

        <div className="profile-details-grid">
          <motion.div 
            className="profile-detail-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="profile-detail-icon">
              <Mail size={24} />
            </div>
            <div>
              <p className="profile-detail-label">Email Address</p>
              <p className="profile-detail-value mb-0">{user.email}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="profile-detail-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="profile-detail-icon">
              <Phone size={24} />
            </div>
            <div>
              <p className="profile-detail-label">Phone Number</p>
              <p className="profile-detail-value mb-0">{user.phone || 'Not provided'}</p>
            </div>
          </motion.div>

          <motion.div 
            className="profile-detail-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="profile-detail-icon">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="profile-detail-label">Wallet Balance</p>
              <div className="d-flex align-items-center gap-2">
                <p className="profile-detail-value mb-0">${parseFloat(user.balance || 0).toFixed(2)}</p>
                <button 
                  onClick={() => navigate('/wallet')} 
                  className="btn-fund-small"
                >
                  Manage
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="profile-detail-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="profile-detail-icon">
              <Shield size={24} />
            </div>
            <div>
              <p className="profile-detail-label">Account Role</p>
              <p className="profile-detail-value mb-0 text-uppercase">{user.role}</p>
            </div>
          </motion.div>
        </div>

        {/* AI Fitness Coach Card */}
        <motion.div
          className="profile-inbody-section mt-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.42 }}
        >
          <div className="profile-inbody-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Cpu size={24} className="inbody-icon me-2 text-warning" />
              <h3 className="inbody-title">AI Fitness Coach</h3>
            </div>
            {aiPlan && !showAiForm && !aiLoading && (
              <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 rounded-pill px-2 py-1 small fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                <Sparkles size={10} /> ENGINE READY
              </span>
            )}
          </div>

          <div className="ai-coach-content p-2">
            {aiLoading ? (
              <div className="ai-loading-container text-center py-4">
                <div className="ai-loading-spinner mb-3">
                  <div className="double-bounce1"></div>
                  <div className="double-bounce2"></div>
                </div>
                <h5 className="text-warning text-uppercase fw-bold mb-1" style={{ letterSpacing: '1px' }}>AI Synthesizing Plan</h5>
                <p className="text-secondary small mb-0 px-3">Computing optimal training splits & macro targets based on your unique body composition...</p>
              </div>
            ) : showAiForm || !aiPlan ? (
              <form onSubmit={handleGenerateAiPlan} className="ai-metrics-form text-start">
                <p className="text-secondary small mb-4">
                  Input your exact biometrics and fitness aspirations. Our AI models will customize a tailored workout split & nutrition schedule.
                </p>

                {aiError && (
                  <div className="alert alert-danger b-0 mb-4 py-2 small d-flex align-items-center gap-2" style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', border: '1px solid rgba(255, 68, 68, 0.2)' }}>
                    <AlertTriangle size={16} />
                    <span>{aiError}</span>
                  </div>
                )}

                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label className="profile-detail-label d-block mb-1">Target Goal</label>
                    <select 
                      name="goal"
                      className="form-control-dark w-100" 
                      value={aiForm.goal}
                      onChange={handleAiFormChange}
                      required
                    >
                      <option value="Weight Loss">Weight Loss</option>
                      <option value="Weight Gain">Weight Gain</option>
                      <option value="Muscle Gain">Muscle Gain</option>
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="profile-detail-label d-block mb-1">Gender</label>
                    <select 
                      name="gender"
                      className="form-control-dark w-100" 
                      value={aiForm.gender}
                      onChange={handleAiFormChange}
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-sm-4">
                    <label className="profile-detail-label d-block mb-1">Age (Years)</label>
                    <input 
                      name="age"
                      type="number"
                      placeholder="e.g. 25"
                      className="form-control-dark w-100"
                      value={aiForm.age}
                      onChange={handleAiFormChange}
                      required
                      min="1"
                      max="120"
                    />
                  </div>
                  <div className="col-sm-4">
                    <label className="profile-detail-label d-block mb-1">Weight (kg)</label>
                    <input 
                      name="weight"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 75"
                      className="form-control-dark w-100"
                      value={aiForm.weight}
                      onChange={handleAiFormChange}
                      required
                      min="10"
                      max="300"
                    />
                  </div>
                  <div className="col-sm-4">
                    <label className="profile-detail-label d-block mb-1">Height (cm)</label>
                    <input 
                      name="height"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 175"
                      className="form-control-dark w-100"
                      value={aiForm.height}
                      onChange={handleAiFormChange}
                      required
                      min="50"
                      max="250"
                    />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-sm-4">
                    <label className="profile-detail-label d-block mb-1">Body Fat (%)</label>
                    <input 
                      name="body_fat"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 15.5"
                      className="form-control-dark w-100"
                      value={aiForm.body_fat}
                      onChange={handleAiFormChange}
                      required
                      min="1"
                      max="70"
                    />
                  </div>
                  <div className="col-sm-4">
                    <label className="profile-detail-label d-block mb-1">Muscle Mass (kg)</label>
                    <input 
                      name="muscle_mass"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 35.0"
                      className="form-control-dark w-100"
                      value={aiForm.muscle_mass}
                      onChange={handleAiFormChange}
                      required
                      min="5"
                      max="150"
                    />
                  </div>
                  <div className="col-sm-4">
                    <label className="profile-detail-label d-block mb-1">Water Percentage (%)</label>
                    <input 
                      name="water_perc"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 58.5"
                      className="form-control-dark w-100"
                      value={aiForm.water_perc}
                      onChange={handleAiFormChange}
                      required
                      min="10"
                      max="90"
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn-premium-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2">
                    <Cpu size={16} /> Synthesize AI Plan
                  </button>
                  {aiPlan && (
                    <button 
                      type="button" 
                      onClick={() => setShowAiForm(false)} 
                      className="btn-premium-sm w-50 py-2"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="ai-plan-display text-start">
                <div className="ai-plan-scroll-box p-3 mb-4 rounded border border-secondary border-opacity-10 bg-black bg-opacity-25" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {renderAiPlanContent()}
                </div>
                <button 
                  onClick={handleResetAiPlan}
                  className="btn-premium-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <RefreshCw size={16} /> Overwrite & Re-Synthesize AI Plan
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          onClick={handleLogout}
          className="btn-neon-logout"
        >
          <LogOut size={22} className="me-3" />
          Terminate Session
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Profile;
