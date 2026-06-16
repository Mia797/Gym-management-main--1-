import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Calendar, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Profile.css'; // Leverage existing profile CSS and common glassmorphic tokens

function ProfileEdit() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    age: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        age: user.age || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);

    if (!formData.name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setLoading(true);
    const result = await updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      age: parseInt(formData.age) || null
    });

    setLoading(false);
    if (result.success) {
      toast.success(result.message || 'Profile updated successfully!');
      navigate('/profile');
    } else {
      toast.error(result.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="profile-container text-white d-flex align-items-center justify-content-center py-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="profile-card p-4 col-12 col-md-8 col-lg-6"
        style={{
          background: 'rgba(20, 20, 20, 0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}
      >
        <div className="d-flex align-items-center gap-2 mb-4 border-bottom border-secondary border-opacity-25 pb-3">
          <button
            onClick={() => navigate('/profile')}
            className="btn btn-link text-white p-0 d-flex align-items-center justify-content-center"
            style={{ textDecoration: 'none' }}
          >
            <ArrowLeft size={24} className="text-warning hover-lift" />
          </button>
          <h2 className="profile-name m-0 fs-3 fw-black text-gradient">Edit Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div className="form-group">
            <label className="text-secondary small fw-bold text-uppercase mb-2 d-flex align-items-center gap-2">
              <User size={14} className="text-warning" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="form-control text-white bg-black bg-opacity-50 border border-secondary border-opacity-25 py-2 px-3"
              style={{
                borderRadius: '8px',
                outline: 'none',
                boxShadow: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div className="form-group">
            <label className="text-secondary small fw-bold text-uppercase mb-2 d-flex align-items-center gap-2">
              <Phone size={14} className="text-warning" /> Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 234 567 8900"
              className="form-control text-white bg-black bg-opacity-50 border border-secondary border-opacity-25 py-2 px-3"
              style={{
                borderRadius: '8px',
                outline: 'none',
                boxShadow: 'none'
              }}
            />
          </div>

          <div className="form-group">
            <label className="text-secondary small fw-bold text-uppercase mb-2 d-flex align-items-center gap-2">
              <MapPin size={14} className="text-warning" /> Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 123 Fitness St, Muscle City"
              className="form-control text-white bg-black bg-opacity-50 border border-secondary border-opacity-25 py-2 px-3"
              style={{
                borderRadius: '8px',
                outline: 'none',
                boxShadow: 'none'
              }}
            />
          </div>

          <div className="form-group">
            <label className="text-secondary small fw-bold text-uppercase mb-2 d-flex align-items-center gap-2">
              <Calendar size={14} className="text-warning" /> Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 25"
              className="form-control text-white bg-black bg-opacity-50 border border-secondary border-opacity-25 py-2 px-3"
              style={{
                borderRadius: '8px',
                outline: 'none',
                boxShadow: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-warning mt-4 py-2 px-4 fw-black text-uppercase d-flex align-items-center justify-content-center gap-2"
            style={{
              borderRadius: '8px',
              letterSpacing: '1px',
              background: 'linear-gradient(135deg, #ff7a00 0%, #ff4400 100%)',
              border: 'none',
              color: '#000',
              fontWeight: 800
            }}
          >
            <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default ProfileEdit;
