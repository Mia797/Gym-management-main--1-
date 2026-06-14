import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSubscriptions, purchaseSubscription, getUserSubscriptions } from '../api/subscriptionApi';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const [catalog, setCatalog] = useState([]);
  const [mySubs, setMySubs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const response = await getSubscriptions();
      if (response.data) {
        // Handle array inside plan, plans, or direct list
        setCatalog(response.data.plans || response.data.subscriptions || (Array.isArray(response.data) ? response.data : []));
      }
    } catch (error) {
      console.error('Failed to fetch subscription catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySubs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await getUserSubscriptions(user);
      if (response.data) {
        setMySubs(response.data.subscriptions || response.data.userSubscriptions || (Array.isArray(response.data) ? response.data : []));
      }
    } catch (error) {
      console.error('Failed to fetch user subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchase = async (planId, goal = '', description = '') => {
    setLoading(true);
    try {
      const payload = {
        plan_id: planId,
        goal: goal || 'General Fitness',
        description: description || 'Standard membership'
      };
      const response = await purchaseSubscription(payload, user);
      if (response.data && (response.data.success || response.data.subscription_id || response.data.message)) {
        toast.success('Subscription purchased successfully!');
        await fetchMySubs();
        await refreshUser(); // Update balance if paid from wallet
        return { success: true };
      }
      return { success: false, message: response.data?.message || 'Purchase failed' };
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Purchase failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
    if (user) {
      fetchMySubs();
    } else {
      setMySubs([]);
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{ catalog, mySubs, loading, fetchCatalog, fetchMySubs, purchase }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
