import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Award, Shield, Sparkles } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useWallet } from '../../context/WalletContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Subscriptions() {
  const { catalog, purchase, fetchCatalog, loading } = useSubscription();
  const { balance } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handlePurchase = async (plan) => {
    if (balance < parseFloat(plan.price)) {
      toast.error(`Insufficient wallet balance. You need $${plan.price} but have $${balance}. Please fund your wallet.`);
      navigate('/wallet');
      return;
    }

    if (confirm(`Are you sure you want to purchase the "${plan.name}" plan for $${plan.price}?`)) {
      const result = await purchase(plan.id);
      if (result.success) {
        navigate('/my-subscriptions');
      }
    }
  };

  const getPlanIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('vip') || lowerName.includes('gold')) return <Award size={32} className="text-warning" />;
    if (lowerName.includes('coach') || lowerName.includes('trainer') || lowerName.includes('pro')) return <Sparkles size={32} className="text-info" />;
    return <Flame size={32} className="text-danger" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80 } }
  };

  return (
    <div className="profile-container text-white py-5 px-3 min-vh-100" style={{ background: '#0a0a0a' }}>
      <div className="text-center mb-5">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="text-warning text-uppercase fw-bold small d-inline-block mb-2"
          style={{ letterSpacing: '2px' }}
        >
          Premium Packages
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fw-black text-gradient display-5 mb-3"
          style={{ fontWeight: 900 }}
        >
          Choose Your Destiny
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          className="lead text-secondary mx-auto"
          style={{ maxWidth: '600px', fontSize: '1rem' }}
        >
          Fund your wallet to unlock pro coaching, tailored diet programs, and full access to elite machinery.
        </motion.p>
      </div>

      {loading && catalog.length === 0 ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading plans...</span>
          </div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="row g-4 justify-content-center max-width-lg mx-auto"
          style={{ maxWidth: '1200px' }}
        >
          {catalog.map((plan) => (
            <div className="col-12 col-md-6 col-lg-4" key={plan.id}>
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(255, 122, 0, 0.15)' }}
                className="h-100 p-4 d-flex flex-column justify-content-between"
                style={{
                  background: 'rgba(20, 20, 20, 0.75)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="p-3 bg-black bg-opacity-40 rounded-3 border border-secondary border-opacity-10">
                      {getPlanIcon(plan.name)}
                    </div>
                    <span
                      className="badge px-3 py-2 text-uppercase fw-bold"
                      style={{
                        background: 'rgba(255, 122, 0, 0.1)',
                        border: '1px solid rgba(255, 122, 0, 0.3)',
                        color: '#ff7a00',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        letterSpacing: '1px'
                      }}
                    >
                      {plan.duration_days || 30} Days
                    </span>
                  </div>

                  <h3 className="fw-black text-white mb-2 fs-4">{plan.name}</h3>
                  <p className="text-secondary small mb-4" style={{ minHeight: '48px', lineHeight: '1.5' }}>
                    {plan.description || 'Access to top-tier workout routines, trainer guidance, and meal planning.'}
                  </p>

                  <div className="d-flex align-items-baseline mb-4">
                    <span className="fs-1 fw-black text-white">${plan.price}</span>
                    <span className="text-secondary small ms-2">/ one-time payment</span>
                  </div>

                  <ul className="list-unstyled d-flex flex-column gap-3 mb-5 border-top border-secondary border-opacity-15 pt-4">
                    <li className="d-flex align-items-start gap-2 text-secondary small">
                      <Check size={16} className="text-warning mt-0.5 flex-shrink-0" />
                      <span>Full Access to Gym Floor & Machines</span>
                    </li>
                    <li className="d-flex align-items-start gap-2 text-secondary small">
                      <Check size={16} className="text-warning mt-0.5 flex-shrink-0" />
                      <span>InBody Scan Parsing & AI Coach Advice</span>
                    </li>
                    {plan.has_trainer ? (
                      <li className="d-flex align-items-start gap-2 text-white small fw-bold">
                        <Check size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span>Personal Trainer Assigned</span>
                      </li>
                    ) : (
                      <li className="d-flex align-items-start gap-2 text-secondary small opacity-50">
                        <span className="w-4 h-4 d-inline-block flex-shrink-0"></span>
                        <span>No Personal Trainer</span>
                      </li>
                    )}
                    {plan.has_nutritionist ? (
                      <li className="d-flex align-items-start gap-2 text-white small fw-bold">
                        <Check size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span>Dedicated Nutritionist Assigned</span>
                      </li>
                    ) : (
                      <li className="d-flex align-items-start gap-2 text-secondary small opacity-50">
                        <span className="w-4 h-4 d-inline-block flex-shrink-0"></span>
                        <span>No Dedicated Nutritionist</span>
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  onClick={() => handlePurchase(plan)}
                  className="btn btn-warning w-100 py-3 fw-black text-uppercase border-0 hover-lift"
                  style={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #ff7a00 0%, #ff4400 100%)',
                    color: '#000',
                    fontWeight: 900,
                    letterSpacing: '1px'
                  }}
                >
                  Activate Package
                </button>
              </motion.div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default Subscriptions;
