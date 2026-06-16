import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center text-white p-4" style={{ background: '#050505' }}>
      <div className="text-center" style={{ maxWidth: '500px' }}>
        
        {/* Animated Warning Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="d-inline-flex p-4 rounded-circle mb-4"
          style={{
            background: 'rgba(255, 122, 0, 0.1)',
            border: '2px dashed var(--accent-primary)'
          }}
        >
          <AlertTriangle size={48} className="text-warning" style={{ color: 'var(--accent-primary)' }} />
        </motion.div>

        {/* 404 Typography */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="fw-black mb-2"
          style={{
            fontSize: '6.5rem',
            background: 'linear-gradient(135deg, #ff7a00, #ff3d00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px',
            lineHeight: '1'
          }}
        >
          404
        </motion.h1>

        {/* Heading */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="fw-black text-white text-uppercase fs-3 mb-3"
          style={{ letterSpacing: '1px' }}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-secondary small mb-5"
          style={{ lineHeight: '1.6' }}
        >
          Oops! The muscle directory you are looking for has been lifted away, or the route doesn't exist. Let's get you back on track.
        </motion.p>

        {/* Back Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/"
            className="btn-premium"
            style={{
              padding: '12px 30px',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={16} /> Return to Arsenal
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

export default NotFound;
