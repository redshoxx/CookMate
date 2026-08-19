export type Ingredient = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
};

export type RecipeStep = {
  id: string;
  text: string;
  timerSeconds?: number;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  minutes: number;
  difficulty: 'Einfach' | 'Mittel' | 'Schwer';
  servings: number;
  category: string;
  imageKey: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  favorite?: boolean;
};

export type ShoppingItem = Ingredient & {
  done: boolean;
  sourceRecipeIds?: string[];
};

export type PantryItem = Ingredient & {
  minimum?: number;
  expiresAt?: string;
};

export type MealPlanEntry = {
  day: number;
  recipeId?: string;
};
