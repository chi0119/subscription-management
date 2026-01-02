export interface Subscription {
  id?: number;
  subscription_id?: string;
  subscription_name: string;
  category_id: number;
  category_name?: string;
  amount: number;
  contract_date?: string;
  payment_cycle_id?: number;
  payment_cycle?: number | string;
  payment_date?: string;
  payment_method_id?: number;
  payment_method?: string;
  notes?: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  category_name: string;
  user_id: number;
}

export interface PaymentCycle {
  id: number;
  payment_cycle_name: string;
}

export interface PaymentMethod {
  id: number;
  payment_method_name: string;
}

export interface SubscriptionData {
  subscriptionName: string;
  category: string;
  contractDate: string;
  paymentCycle: number | string;
  paymentDate: number | string;
  paymentMethod: string;
  notes: string;
}
