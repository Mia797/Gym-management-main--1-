import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, RefreshCw, XCircle, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { cancelBooking, getActiveBookings } from '../../api/bookingApi';
import { toast } from 'react-toastify';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'active'
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const [historyRes, activeRes] = await Promise.allSettled([
        axios.get('/api/bookings/user'),
        getActiveBookings()
      ]);

      if (historyRes.status === 'fulfilled' && historyRes.value.data?.bookings) {
        setBookings(historyRes.value.data.bookings);
      }
      
      if (activeRes.status === 'fulfilled') {
        const data = activeRes.value.data;
        if (data?.bookings) {
          setActiveBookings(data.bookings);
        } else if (data?.activeBookings) {
          setActiveBookings(data.activeBookings);
        } else if (Array.isArray(data)) {
          setActiveBookings(data);
        } else {
          setActiveBookings([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch bookings data:', error);
      toast.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this equipment booking?')) return;

    setCancellingId(bookingId);
    try {
      const response = await cancelBooking(bookingId);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Booking cancelled successfully!');
        await fetchBookings();
      } else {
        toast.error(response.data?.message || 'Failed to cancel booking.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    let style = { background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)', color: '#ffc107' };
    
    if (s === 'confirmed' || s === 'active' || s === 'completed') {
      style = { background: 'rgba(40, 167, 69, 0.1)', border: '1px solid rgba(40, 167, 69, 0.3)', color: '#28a745' };
    } else if (s === 'cancelled' || s === 'rejected') {
      style = { background: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.3)', color: '#dc3545' };
    }

    return (
      <span className="badge px-3 py-1.5 text-uppercase fw-bold" style={{ ...style, borderRadius: '20px', fontSize: '0.65rem' }}>
        {status || 'Pending'}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatTimeSlot = (booking) => {
    if (booking.time_slot || booking.slot) return booking.time_slot || booking.slot;
    if (booking.start_time && booking.end_time) {
      try {
        const start = new Date(booking.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const end = new Date(booking.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return `${start} - ${end}`;
      } catch {
        return `${booking.start_time} - ${booking.end_time}`;
      }
    }
    return 'N/A';
  };

  const getActiveTabBookings = () => {
    return activeTab === 'history' ? bookings : activeBookings;
  };

  const currentList = getActiveTabBookings();

  return (
    <div className="profile-container text-white py-5 px-3 min-vh-100" style={{ background: '#0a0a0a' }}>
      <div className="max-width-lg mx-auto" style={{ maxWidth: '900px' }}>
        
        <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-secondary border-opacity-15 pb-4">
          <div>
            <h1 className="fw-black text-gradient display-6 mb-2">Bookings Hub</h1>
            <p className="text-secondary small m-0">Track and manage your machine check-ins and session reservations.</p>
          </div>
          <button 
            onClick={fetchBookings} 
            className="btn btn-link text-warning p-0 hover-lift d-flex align-items-center gap-2"
            style={{ textDecoration: 'none' }}
          >
            <RefreshCw size={18} className={loading ? 'spin-animation' : ''} />
            <span className="small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Refresh</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="d-flex gap-3 mb-5 p-1.5 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', width: 'fit-content' }}>
          <button
            onClick={() => setActiveTab('history')}
            className="btn btn-sm px-4 py-2.5 fw-bold text-uppercase transition-all"
            style={{
              background: activeTab === 'history' ? 'linear-gradient(135deg, #ff7a00, #ff4400)' : 'transparent',
              color: activeTab === 'history' ? '#000' : '#888',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.72rem',
              letterSpacing: '0.5px'
            }}
          >
            Booking History ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className="btn btn-sm px-4 py-2.5 fw-bold text-uppercase transition-all d-flex align-items-center gap-2"
            style={{
              background: activeTab === 'active' ? 'linear-gradient(135deg, #28a745, #1e7e34)' : 'transparent',
              color: activeTab === 'active' ? '#fff' : '#888',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.72rem',
              letterSpacing: '0.5px'
            }}
          >
            Currently Using
            {activeBookings.length > 0 ? (
              <span className="badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                {activeBookings.length}
              </span>
            ) : (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#28a745', display: 'inline-block' }} />
            )}
          </button>
        </div>

        {loading && currentList.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading bookings...</span>
            </div>
          </div>
        ) : currentList.length === 0 ? (
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
            <ShieldAlert size={48} className="text-secondary mb-3 opacity-40" />
            <h3 className="fw-bold text-white mb-2">
              {activeTab === 'history' ? 'No Bookings Found' : 'No Active Check-ins'}
            </h3>
            <p className="text-secondary small mb-0">
              {activeTab === 'history'
                ? "You don't have any pending or past equipment bookings."
                : "You are not currently using any equipment. Reserve one from the Machines page!"}
            </p>
          </motion.div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {currentList.map((booking, idx) => {
              const s = booking.status ? booking.status.toLowerCase() : 'pending';
              const canCancel = activeTab === 'history' && s !== 'cancelled' && s !== 'rejected' && s !== 'completed';
              const isCheckingIn = activeTab === 'active';

              return (
                <motion.div
                  key={booking.id || idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="p-4"
                  style={{
                    background: isCheckingIn ? 'rgba(40, 167, 69, 0.03)' : 'rgba(20, 20, 20, 0.75)',
                    backdropFilter: 'blur(12px)',
                    border: isCheckingIn 
                      ? '1px solid rgba(40, 167, 69, 0.35)' 
                      : '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '16px',
                    boxShadow: isCheckingIn 
                      ? '0 0 20px rgba(40, 167, 69, 0.15)' 
                      : '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div className="row g-3 align-items-center">
                    <div className="col-12 col-md-4">
                      <span className="text-secondary small text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>
                        Equipment / Room
                      </span>
                      <h4 className="fw-black text-white m-0 fs-6">{booking.equipment_name || booking.machine_name || 'Gym Machine'}</h4>
                    </div>

                    <div className="col-12 col-md-3">
                      <span className="text-secondary small text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>
                        {isCheckingIn ? 'Check-in Time' : 'Reserved Slot'}
                      </span>
                      <div className="text-white small d-flex flex-column">
                        <span className="d-flex align-items-center gap-1"><Calendar size={12} className="text-warning" /> {formatDate(booking.date || booking.start_time)}</span>
                        <span className="d-flex align-items-center gap-1 mt-1 text-secondary"><Clock size={12} /> {formatTimeSlot(booking)}</span>
                      </div>
                    </div>

                    <div className="col-12 col-md-2">
                      <span className="text-secondary small text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>
                        Booking Status
                      </span>
                      {isCheckingIn ? (
                        <div className="d-flex align-items-center gap-2">
                          <motion.div
                            animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ repeat: Infinity, duration: 1.8 }}
                            style={{ width: 8, height: 8, borderRadius: '50%', background: '#28a745', display: 'inline-block' }}
                          />
                          <span className="badge px-3 py-1.5 fw-bold" style={{ background: 'rgba(40, 167, 69, 0.15)', border: '1px solid rgba(40, 167, 69, 0.3)', color: '#28a745', borderRadius: '20px', fontSize: '0.65rem' }}>
                            ACTIVE NOW
                          </span>
                        </div>
                      ) : (
                        getStatusBadge(booking.status)
                      )}
                    </div>

                    <div className="col-12 col-md-3 text-md-end">
                      {canCancel && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="btn btn-outline-danger btn-sm py-2 px-3 fw-bold text-uppercase d-inline-flex align-items-center gap-2 hover-lift"
                          style={{
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            border: '1px solid rgba(220, 53, 69, 0.4)'
                          }}
                        >
                          <XCircle size={14} /> {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingHistory;
