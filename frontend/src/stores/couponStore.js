import { create } from 'zustand';
import axios from 'axios';

const useCouponStore = create((set, get) => ({
  coupons: [],
  loading: false,
  error: null,
  selectedCoupon: null,
  
  // Fetch all coupons for the user
  fetchCoupons: async (usedFilter = null) => {
    set({ loading: true, error: null });
    try {
      let url = '/api/coupons';
      if (usedFilter !== null) {
        url += `?used=${usedFilter}`;
      }
      
      const response = await axios.get(url);
      set({ coupons: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch coupons', 
        loading: false 
      });
      return [];
    }
  },
  
  // Save a new coupon after scanning
  saveCoupon: async (barcodeData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/coupons', barcodeData);
      set(state => ({ 
        coupons: [response.data, ...state.coupons],
        loading: false 
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to save coupon', 
        loading: false 
      });
      return null;
    }
  },
  
  // Mark a coupon as used
  markCouponAsUsed: async (couponId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/coupons/${couponId}/mark-used`);
      
      // Update the coupon in the list
      set(state => ({
        coupons: state.coupons.map(coupon => 
          coupon.id === couponId ? response.data : coupon
        ),
        loading: false
      }));
      
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to mark coupon as used', 
        loading: false 
      });
      return null;
    }
  },
  
  // Delete a coupon
  deleteCoupon: async (couponId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/coupons/${couponId}`);
      
      // Remove the coupon from the list
      set(state => ({
        coupons: state.coupons.filter(coupon => coupon.id !== couponId),
        loading: false
      }));
      
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to delete coupon', 
        loading: false 
      });
      return false;
    }
  },
  
  // Set selected coupon for payout mode
  selectCoupon: (coupon) => {
    set({ selectedCoupon: coupon });
  },
  
  // Clear selected coupon
  clearSelectedCoupon: () => {
    set({ selectedCoupon: null });
  }
}));

export default useCouponStore;
