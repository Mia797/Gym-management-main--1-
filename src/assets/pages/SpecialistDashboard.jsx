import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Star, Calendar, RefreshCw, Edit3, ChevronRight, Activity, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { getSpecialistDashboard } from '../../api/specialistApi';
import { toast } from 'react-toastify';

function SpecialistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const dashboardResponse = await getSpecialistDashboard();
      const nextDashboardData = dashboardResponse.data;

      if (nextDashboardData) {
        setDashboardData(nextDashboardData);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load specialist statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'trainer' || user.role === 'nutritionist')) {
      fetchDashboard();
    }
  }, [user]);

  if (!user || (user.role !== 'trainer' && user.role !== 'nutritionist')) {
    return <Navigate to="/" />;
  }

  const stats = [
    { title: 'Active Clients', value: dashboardData?.active_clients || 0, icon: Users, color: '#ff7a00' },
    { title: 'Client Rating', value: `${parseFloat(dashboardData?.rating || 4.9).toFixed(1)} ★`, icon: Star, color: '#ffc107' },
    { title: 'Est. Earnings', value: `$${parseFloat(dashboardData?.earnings || 1450).toFixed(2)}`, icon: DollarSign, color: '#28a745' }
  ];

  return (
    <div className="profile-container text-white py-5 px-3 min-vh-100" style={{ background: '#0a0a0a' }}>
      <div className="max-width-lg mx-auto" style={{ maxWidth: '1050px' }}>
        
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-5 border-bottom border-secondary border-opacity-15 pb-4">
          <div>
            <h1 className="fw-black text-gradient display-5 mb-2" style={{ fontWeight: 900 }}>Specialist Dashboard</h1>
            <p className="text-secondary small m-0">Welcome back, Coach {user.name}! Manage your rosters and client fitness splits.</p>
          </div>
          <div className="d-flex gap-3">
            <button 
              onClick={() => navigate('/specialist/profile/edit')}
              className="btn btn-warning py-2 px-4 fw-black text-uppercase d-flex align-items-center gap-2 hover-lift"
              style={{
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ff7a00 0%, #ff4400 100%)',
                color: '#000',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}
            >
              Edit Qualifications
            </button>
            <button 
              onClick={fetchDashboard} 
              className="btn btn-link text-warning p-0 hover-lift d-flex align-items-center gap-2"
              style={{ textDecoration: 'none' }}
            >
              <RefreshCw size={18} className={loading ? 'spin-animation' : ''} />
              <span className="small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Sync</span>
            </button>
          </div>
        </div>

        {loading && !dashboardData ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : (
          <div>
            {/* Stats Cards */}
            <div className="row g-4 mb-5">
              {stats.map((stat, index) => (
                <div key={index} className="col-12 col-md-4">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4"
                    style={{
                      background: 'rgba(20, 20, 20, 0.7)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <stat.icon size={28} style={{ color: stat.color }} className="mb-3" />
                    <h4 className="text-secondary small mb-1 text-uppercase fw-bold" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>{stat.title}</h4>
                    <h2 className="text-white fw-black mb-0 fs-3">{stat.value}</h2>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Profile bio preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 mb-5"
              style={{
                background: 'rgba(20,20,20,0.5)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                backdropFilter: 'blur(8px)'
              }}
            >
              <h4 className="fw-black text-white text-uppercase fs-6 mb-3 d-flex align-items-center gap-2" style={{ letterSpacing: '1px' }}>
                <Award size={18} className="text-warning" /> Specialty bio
              </h4>
              <p className="text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
                {dashboardData?.specialist_profile?.bio || 'Certified Fitness Professional specializing in tailored high-performance programs.'}
              </p>
              {dashboardData?.specialist_profile?.experience_years && (
                <div className="mt-3 text-warning small fw-bold">
                  Professional Experience: {dashboardData.specialist_profile.experience_years} Years
                </div>
              )}
            </motion.div>

            {/* Assigned Clients split */}
            <h3 className="fw-black text-white mb-4 fs-5 text-uppercase d-flex align-items-center gap-2" style={{ letterSpacing: '1px' }}>
              <Activity size={18} className="text-warning" /> Client Planning split
            </h3>

            {(!dashboardData?.client_plans || dashboardData.client_plans.length === 0) ? (
              <div className="text-center py-5 rounded-4" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span className="text-secondary small">No client plans currently assigned to your docket.</span>
              </div>
            ) : (
              <div className="table-responsive rounded-4 overflow-hidden" style={{ border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <table className="table table-dark table-hover align-middle mb-0 small" style={{ background: 'rgba(15, 15, 15, 0.7)' }}>
                  <thead>
                    <tr className="border-bottom border-secondary border-opacity-25" style={{ background: 'rgba(25, 25, 25, 0.5)' }}>
                      <th className="text-secondary text-uppercase fw-bold py-3 px-4" style={{ fontSize: '0.65rem' }}>Client Details</th>
                      <th className="text-secondary text-uppercase fw-bold py-3" style={{ fontSize: '0.65rem' }}>Program ID</th>
                      <th className="text-secondary text-uppercase fw-bold py-3 text-center" style={{ fontSize: '0.65rem' }}>Current Status</th>
                      <th className="text-secondary text-uppercase fw-bold py-3 text-end px-4" style={{ fontSize: '0.65rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.client_plans.map((plan, idx) => (
                      <tr key={plan.id || idx} className="border-bottom border-secondary border-opacity-10">
                        <td className="py-3 px-4">
                          <span className="text-white fw-bold d-block">{plan.user_name || 'Gym Member'}</span>
                          <span className="text-secondary small d-block" style={{ fontSize: '0.75rem' }}>Email: {plan.user_email || 'client@goldfit.com'}</span>
                        </td>
                        <td className="py-3 text-white fw-semibold">#{plan.plan_id || plan.id}</td>
                        <td className="py-3 text-center">
                          <span
                            className="badge px-3 py-1.5 text-uppercase fw-bold"
                            style={{
                              borderRadius: '20px',
                              fontSize: '0.6rem',
                              background: plan.status === 'active' || plan.status === 'completed' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                              color: plan.status === 'active' || plan.status === 'completed' ? '#28a745' : '#ffc107',
                              border: plan.status === 'active' || plan.status === 'completed' ? '1px solid rgba(40, 167, 69, 0.3)' : '1px solid rgba(255, 193, 7, 0.3)'
                            }}
                          >
                            {plan.status || 'planning'}
                          </span>
                        </td>
                        <td className="py-3 text-end px-4">
                          <button
                            onClick={() => {
                              const planId = plan.plan_id || plan.id;
                              if (user.role === 'trainer') {
                                navigate(`/specialist/plan/${planId}/workout`);
                              } else {
                                navigate(`/specialist/plan/${planId}/meals`);
                              }
                            }}
                            className="btn btn-sm btn-outline-warning py-1.5 px-3 rounded fw-bold text-uppercase d-inline-flex align-items-center gap-1 hover-lift"
                            style={{ fontSize: '0.75rem' }}
                          >
                            <Edit3 size={12} /> Manage Split <ChevronRight size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default SpecialistDashboard;
