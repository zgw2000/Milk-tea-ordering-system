export interface Ingredient {
    _id: string
    name: string
    cost: number
  }
  
  export interface DraftOrder {
    customerId: string
    ingredientIds: string[]
    sweetness: number
    ice: number
  }
  
  export interface Order extends DraftOrder {
    _id: string
    state: "draft" | "queued" | "blending" | "done"
    operatorId?: string
  }
  
  export interface Customer {
    _id: string
    name: string
    password: string
  }
  
  export interface CustomerWithOrders extends Customer {
    orders: Order[]
  }
  
  export interface OperatorWithOrders extends Operator {
    orders: Order[]
  }
  
  export interface Operator {
    _id: string
    name: string
    password: string
  }
  
  // for preset ingredients
  export interface DrinkIngredients  {
    [key: string]: Ingredient[];
  }