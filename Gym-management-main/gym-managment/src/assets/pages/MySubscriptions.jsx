import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Calendar, CreditCard, ExternalLink, RefreshCw, Dumbbell, Apple, CheckCircle2, Clock, TrendingUp, Zap } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

function MySubscriptions() {
  const { mySubs, fetchMySubs, loading } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMySubs();
  }, []);

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    let style = { background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)', color: '#ffc107' }; // default/pending
    
    if (s === 'active' || s === 'completed_plans' || s === 'active_plans') {
      style = { background: 'rgba(40, 167, 69, 0.1)', border: '1px solid rgba(40, 167, 69, 0.3)', color: '#28a745' };
    } else if (s === 'cancelled' || s === 'expired') {
      style = { background: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.3)', color: '#dc3545' };
    } else if (s === 'planning' || s === 'assigned') {
      style = { background: 'rgba(23, 162, 184, 0.1)', border: '1px solid rgba(23, 162, 184, 0.3)', color: '#17a2b8' };
    }

    return (
      <span className="badge px-3 py-2 text-uppercase fw-bold" style={{ ...style, borderRadius: '20px', fontSize: '0.7rem' }}>
        {status || 'Pending'}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not Activated';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getPlanTypeFeatures = (planType) => {
    const features = [];
    if (planType?.includes('gym') || planType === 'both') {
      features.push({ icon: <Dumbbell size={14} />, label: 'Training Plan', color: '#ff7a00' });
    }
    if (planType?.includes('diet') || planType === 'both') {
      features.push({ icon: <Apple size={14} />, label: 'Nutrition Plan', color: '#00e673' });
    }
    return features;
  };

  return (
    <div className="profile-container text-white py-5 px-3 min-vh-100" style={{ background: '#0a0a0a' }}>
      <div className="max-width-lg mx-auto" style={{ maxWidth: '1000px' }}>
        <div className="d-flex align-items-center justify-content-between mb-5 border-bottom border-secondary border-opacity-15 pb-4">
          <div>
            <h1 className="fw-black text-gradient display-6 mb-2">My Plan</h1>
            <p className="text-secondary small m-0">Track your active package, status, assigned specialists, and plan details in one place.</p>
          </div>
          <button 
            onClick={fetchMySubs} 
            className="btn btn-link text-warning p-0 hover-lift d-flex align-items-center gap-2"
            style={{ textDecoration: 'none' }}
          >
            <RefreshCw size={18} className={loading ? 'spin-animation' : ''} />
            <span className="small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Refresh</span>
          </button>
        </div>

        {loading && mySubs.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading memberships...</span>
            </div>
          </div>
        ) : mySubs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-5 p-4 rounded-4"
            style={{
              background: 'rgba(20, 20, 20, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Shield size={48} className="text-secondary mb-3 opacity-40" />
            <h3 className="fw-bold text-white mb-2">No Memberships Yet</h3>
            <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: '400px' }}>
              You don't have any active or past gym memberships. Browse our available programs to get started on your fitness journey.
            </p>
            <button
              onClick={() => navigate('/subscriptions')}
              className="btn btn-warning px-4 py-2 fw-black text-uppercase border-0 hover-lift"
              style={{
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ff7a00 0%, #ff4400 100%)',
                color: '#000',
                fontSize: '0.85rem'
              }}
            >
              Browse Catalogs
            </button>
          </motion.div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {mySubs.map((sub, idx) => (
              <motion.div
                key={sub.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4"
                style={{
                  background: 'rgba(20, 20, 20, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Header Section */}
                <div className="row g-4 align-items-center mb-4">
                  <div className="col-12 col-md-5">
                    <span className="text-secondary small text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                      Package Name
                    </span>
                    <h4 className="fw-black text-white m-0 fs-5">{sub.plan_name || 'Gym Subscription'}</h4>
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <CreditCard size={14} className="text-secondary" />
                      <span className="text-secondary small">Paid: ${sub.price_paid || sub.price || '0.00'}</span>
                    </div>
                  </div>

                  <div className="col-12 col-md-3">
                    <span className="text-secondary small text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                      Status
                    </span>
                    {getStatusBadge(sub.status)}
                  </div>

                  <div className="col-12 col-md-4">
                    <span className="text-secondary small text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                      Membership Dates
                    </span>
                    <div className="d-flex align-items-center gap-2 text-secondary small">
                      <Calendar size={14} />
                      <span>{formatDate(sub.start_date)} - {formatDate(sub.end_date)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-top border-secondary border-opacity-15 pt-4">
                  {/* Plan Type Benefits */}
                  <div className="mb-4">
                    <span className="text-secondary small text-uppercase fw-bold d-block mb-2" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                      📦 What's Included
                    </span>
                    <div className="d-flex flex-wrap gap-2">
                      {getPlanTypeFeatures(sub.plan_type).map((feature, i) => (
                        <div key={i} className="d-flex align-items-center gap-2 px-3 py-2 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <span style={{ color: feature.color }}>{feature.icon}</span>
                          <span className="text-white small fw-semibold">{feature.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assigned specialists & plans info */}
                  {(sub.trainer_name || sub.nutritionist_name || sub.training_plan_id || sub.nutrition_plan_id) && (
                    <div className="mb-4">
                      <span className="text-secondary small text-uppercase fw-bold d-block mb-3" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                        👥 Your Assigned Specialists
                      </span>
                      <div className="row g-2">
                        {sub.trainer_name && (
                          <div className="col-12 col-sm-6">
                            <div className="p-3 rounded-3" style={{ background: 'rgba(255, 122, 0, 0.05)', border: '1px solid rgba(255, 122, 0, 0.2)' }}>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <Dumbbell size={14} style={{ color: '#ff7a00' }} />
                                <span className="text-secondary small text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>Trainer</span>
                              </div>
                              <span className="text-white small fw-bold">{sub.trainer_name}</span>
                            </div>
                          </div>
                        )}
                        {sub.nutritionist_name && (
                          <div className="col-12 col-sm-6">
                            <div className="p-3 rounded-3" style={{ background: 'rgba(0, 230, 115, 0.05)', border: '1px solid rgba(0, 230, 115, 0.2)' }}>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <Apple size={14} style={{ color: '#00e673' }} />
                                <span className="text-secondary small text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>Nutritionist</span>
                              </div>
                              <span className="text-white small fw-bold">{sub.nutritionist_name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 flex-wrap">
                    {sub.training_plan_id && (
                      <button
                        onClick={() => navigate(`/training/${sub.training_plan_id}`)}
                        className="btn py-2 px-3 small d-flex align-items-center gap-2 hover-lift"
                        style={{ 
                          borderRadius: '8px', 
                          fontSize: '0.8rem', 
                          background: 'rgba(255, 122, 0, 0.1)',
                          border: '1px solid rgba(255, 122, 0, 0.4)',
                          color: '#ff7a00',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Dumbbell size={14} /> View Training <ExternalLink size={12} />
                      </button>
                    )}
                    {sub.nutrition_plan_id && (
                      <button
                        onClick={() => navigate(`/nutrition/${sub.nutrition_plan_id}`)}
                        className="btn py-2 px-3 small d-flex align-items-center gap-2 hover-lift"
                        style={{ 
                          borderRadius: '8px', 
                          fontSize: '0.8rem', 
                          background: 'rgba(0, 230, 115, 0.1)',
                          border: '1px solid rgba(0, 230, 115, 0.4)',
                          color: '#00e673',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Apple size={14} /> View Nutrition <ExternalLink size={12} />
                      </button>
                    )}
                    {!sub.training_plan_id && !sub.nutrition_plan_id && (
                      <div className="alert alert-warning alert-sm p-2 m-0 d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', borderRadius: '8px' }}>
                        <Clock size={14} />
                        <span>Plans pending assignment</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySubscriptions;
