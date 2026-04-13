import api from './api';

export interface ApplyCouponResponse {
  success: boolean;
  coupon_code?: string;
  discount_amount?: number;
  final_amount?: number;
  message: string;
}

export const applyCoupon = async (code: string, order_amount: number): Promise<ApplyCouponResponse> => {
  const response = await api.post('/coupons/apply', { code, order_amount });
  return response.data;
};
