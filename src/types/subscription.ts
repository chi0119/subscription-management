export interface Subscription {
  id?: number;
  subscription_name: string;
  category_id: number;
  amount: number;
  contract_date?: string;
  payment_cycle_id?: number;
  payment_date?: string;
  payment_method_id?: number;
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
