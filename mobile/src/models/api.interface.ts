export interface Expense {
  id: number;
  category: string;
  value: number;
  description: string;
  created_at: string;
}

export interface GroceryItem {
  name: string;
  to_buy: boolean;
  created_at: string;
}

export interface DateRequest {
  id: number;
  description: string;
  planned_date: string;
  duration_minutes: number;
  created_by: string;
  created_at: string;
}
