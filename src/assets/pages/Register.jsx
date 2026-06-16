import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Dumbbell, User, Phone, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    role: 'user',
    gender: 'male',
    address: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(formData);
    if (result.success) {
      alert('Registration successful! Please login.');
      navigate('/login');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="register-container">
      <motion.div 
        className="register-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-4">
          <Dumbbell size={48} className="mb-3" style={{ color: 'var(--accent-primary)' }} />
          <h2 className="fw-black text-uppercase mb-1 text-white">Join <span className="text-gradient">GOLDFIT</span></h2>
          <p className="text-secondary small">Start your fitness transformation today.</p>
        </div>

        {error && <div className="alert alert-danger b-0 mb-4 py-2 small" style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', border: '1px solid rgba(255, 68, 68, 0.2)' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-sm-6">
              <div className="input-icon-wrapper">
                <input 
                  name="firstName"
                  type="text" 
                  className="form-control-dark" 
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <User className="input-icon" size={18} />
              </div>
            </div>
            
            <div className="col-sm-6">
              <div className="input-icon-wrapper">
                <input 
                  name="lastName"
                  type="text" 
                  className="form-control-dark" 
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <User className="input-icon" size={18} />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="input-icon-wrapper">
              <input 
                name="email"
                type="email" 
                className="form-control-dark" 
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Mail className="input-icon" size={18} />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="input-icon-wrapper">
              <input 
                name="password"
                type="password" 
                className="form-control-dark" 
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Lock className="input-icon" size={18} />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-sm-6">
              <div className="input-icon-wrapper">
                <input 
                  name="phone"
                  type="tel" 
                  className="form-control-dark" 
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Phone className="input-icon" size={18} />
              </div>
            </div>
            
            <div className="col-sm-6">
              <div className="input-icon-wrapper">
                <input 
                  name="age"
                  type="number" 
                  className="form-control-dark" 
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
                <Calendar className="input-icon" size={18} />
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-sm-4">
                <div className="input-icon-wrapper">
                    <select
                        name="role"
                        className="form-control-dark"
                        value={formData.role}
                        onChange={handleChange}
                        style={{ appearance: 'none', paddingLeft: '40px' }}
                    >
                        <option value="user">Member</option>
                        <option value="trainer">Trainer</option>
                        <option value="nutritionist">Nutritionist</option>
                        <option value="admin">Admin</option>
                    </select>
                    <User className="input-icon" size={18} />
                </div>
            </div>
            
            <div className="col-sm-8">
              <div className="input-icon-wrapper">
                <input 
                  name="address"
                  type="text" 
                  className="form-control-dark" 
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
                <MapPin className="input-icon" size={18} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-register mb-4">
            Create Account
          </button>
        </form>

        <div className="text-center">
          <p className="text-secondary small mb-0">
            Already have an account? <Link to="/login" className="text-gradient text-decoration-none fw-bold ms-1" style={{ transition: 'filter 0.3s' }} onMouseOver={(e)=>e.currentTarget.style.filter='brightness(1.2)'} onMouseOut={(e)=>e.currentTarget.style.filter='none'}>Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;