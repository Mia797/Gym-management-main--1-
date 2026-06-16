import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AIPlans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aiPlans, setAIPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlans, setExpandedPlans] = useState({});

  // Mock data for testing
  useEffect(() => {
    if (user) {
      setLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        setAIPlans([
          {
            id: 1,
            created_at: new Date().toISOString(),
            inbody: {
              goal: 'Weight Loss',
              weight: 75,
              height: 175,
              age: 25,
              gender: 'male',
              body_fat: 15.5,
              muscle_mass: 35,
              water_perc: 58.5
            },
            ai_plan: {
              calories: 2000,
              protein: 150,
              carbs: 200,
              fat: 67,
              workout_plan: {
                training_days_per_week: 4,
                cardio_minutes_per_week: 120,
                strength_sessions: 3,
                recommended_sets: 3,
                recommended_reps: 12
              },
              plan: [
                { food: 'Chicken Breast', servings: 2, calories: 300, protein: 50, carbs: 0, fat: 6 },
                { food: 'Brown Rice', servings: 1, calories: 200, protein: 5, carbs: 45, fat: 2 }
              ]
            }
          }
        ]);
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [user]);

  const togglePlan = (planId) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '20px', color: 'white', background: '#0a0a0a', minHeight: '100vh' }}>
        <h2>Authentication Required</h2>
        <p>Please sign in to view your AI plans.</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', color: 'white', background: '#0a0a0a', minHeight: '100vh' }}>
      <h1>AI Plans</h1>
      <p>View your AI-generated fitness and nutrition plans.</p>
      
      {loading ? (
        <p>Loading...</p>
      ) : aiPlans.length === 0 ? (
        <p>No AI Plans Yet</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {aiPlans.map((plan, idx) => (
            <div key={plan.id || idx} style={{ 
              background: 'rgba(30, 30, 30, 0.8)', 
              padding: '20px', 
              marginBottom: '20px', 
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{plan.inbody?.goal || 'Fitness Plan'}</h3>
                  <small style={{ color: '#888' }}>{formatDate(plan.created_at)}</small>
                </div>
                <button 
                  onClick={() => togglePlan(plan.id)}
                  style={{ 
                    background: '#ff7a00', 
                    color: 'black', 
                    border: 'none', 
                    padding: '8px 16px', 
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {expandedPlans[plan.id] ? 'Hide Plan' : 'Show Plan'}
                </button>
              </div>

              {/* Inbody Data - Always Visible */}
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Body Composition Data</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '5px' }}>
                    <div>Weight</div>
                    <strong>{plan.inbody?.weight || 'N/A'} kg</strong>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '5px' }}>
                    <div>Height</div>
                    <strong>{plan.inbody?.height || 'N/A'} cm</strong>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '5px' }}>
                    <div>Age</div>
                    <strong>{plan.inbody?.age || 'N/A'}</strong>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '5px' }}>
                    <div>Gender</div>
                    <strong>{plan.inbody?.gender || 'N/A'}</strong>
                  </div>
                  <div style={{ background: 'rgba(255, 122, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>
                    <div>Body Fat</div>
                    <strong>{plan.inbody?.body_fat || 'N/A'}%</strong>
                  </div>
                  <div style={{ background: 'rgba(0, 230, 115, 0.1)', padding: '10px', borderRadius: '5px' }}>
                    <div>Muscle Mass</div>
                    <strong>{plan.inbody?.muscle_mass || 'N/A'} kg</strong>
                  </div>
                  <div style={{ background: 'rgba(23, 162, 184, 0.1)', padding: '10px', borderRadius: '5px' }}>
                    <div>Water %</div>
                    <strong>{plan.inbody?.water_perc || 'N/A'}%</strong>
                  </div>
                </div>
              </div>

              {/* AI Plan - Expandable */}
              {expandedPlans[plan.id] && (
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>AI-Generated Plan</h4>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h5 style={{ fontSize: '12px', marginBottom: '8px' }}>Daily Nutrition Targets</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                      <div style={{ background: 'rgba(255, 122, 0, 0.1)', padding: '8px', borderRadius: '5px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px' }}>Calories</div>
                        <strong>{plan.ai_plan?.calories || 'N/A'}</strong>
                      </div>
                      <div style={{ background: 'rgba(0, 230, 115, 0.1)', padding: '8px', borderRadius: '5px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px' }}>Protein</div>
                        <strong>{plan.ai_plan?.protein || 'N/A'}g</strong>
                      </div>
                      <div style={{ background: 'rgba(255, 193, 7, 0.1)', padding: '8px', borderRadius: '5px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px' }}>Carbs</div>
                        <strong>{plan.ai_plan?.carbs || 'N/A'}g</strong>
                      </div>
                      <div style={{ background: 'rgba(220, 53, 69, 0.1)', padding: '8px', borderRadius: '5px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px' }}>Fat</div>
                        <strong>{plan.ai_plan?.fat || 'N/A'}g</strong>
                      </div>
                    </div>
                  </div>

                  {plan.ai_plan?.workout_plan && (
                    <div style={{ marginBottom: '15px' }}>
                      <h5 style={{ fontSize: '12px', marginBottom: '8px' }}>Workout Plan Summary</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '5px' }}>
                          <div style={{ fontSize: '12px' }}>Training Days</div>
                          <strong>{plan.ai_plan.workout_plan.training_days_per_week || 'N/A'}/week</strong>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '5px' }}>
                          <div style={{ fontSize: '12px' }}>Cardio</div>
                          <strong>{plan.ai_plan.workout_plan.cardio_minutes_per_week || 'N/A'} min/week</strong>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '5px' }}>
                          <div style={{ fontSize: '12px' }}>Strength Sessions</div>
                          <strong>{plan.ai_plan.workout_plan.strength_sessions || 'N/A'}</strong>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '5px' }}>
                          <div style={{ fontSize: '12px' }}>Sets × Reps</div>
                          <strong>{plan.ai_plan.workout_plan.recommended_sets || 'N/A'} × {plan.ai_plan.workout_plan.recommended_reps || 'N/A'}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {plan.ai_plan?.plan && Array.isArray(plan.ai_plan.plan) && plan.ai_plan.plan.length > 0 && (
                    <div>
                      <h5 style={{ fontSize: '12px', marginBottom: '8px' }}>Detailed Plan</h5>
                      <div style={{ 
                        background: 'rgba(255, 255, 255, 0.02)', 
                        padding: '10px', 
                        borderRadius: '5px',
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                              <th style={{ padding: '8px', textAlign: 'left', color: '#888' }}>Food</th>
                              <th style={{ padding: '8px', textAlign: 'center', color: '#888' }}>Servings</th>
                              <th style={{ padding: '8px', textAlign: 'center', color: '#888' }}>Calories</th>
                              <th style={{ padding: '8px', textAlign: 'center', color: '#888' }}>Protein</th>
                              <th style={{ padding: '8px', textAlign: 'center', color: '#888' }}>Carbs</th>
                              <th style={{ padding: '8px', textAlign: 'center', color: '#888' }}>Fat</th>
                            </tr>
                          </thead>
                          <tbody>
                            {plan.ai_plan.plan.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <td style={{ padding: '8px', textTransform: 'capitalize' }}>{item.food}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{item.servings}x</td>
                                <td style={{ padding: '8px', textAlign: 'center', color: '#ff7a00' }}>{item.calories}</td>
                                <td style={{ padding: '8px', textAlign: 'center', color: '#00e673' }}>{item.protein}g</td>
                                <td style={{ padding: '8px', textAlign: 'center', color: '#ffc107' }}>{item.carbs}g</td>
                                <td style={{ padding: '8px', textAlign: 'center', color: '#dc3545' }}>{item.fat}g</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIPlans;
