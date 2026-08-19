import React, { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import Storage from 'expo-sqlite/kv-store';
import { initialPantry, initialPlan, initialShopping, recipes as seedRecipes } from '@/data/seed';
import { MealPlanEntry, PantryItem, Recipe, ShoppingItem } from '@/types/models';

type State = {
  recipes: Recipe[];
  shopping: ShoppingItem[];
  pantry: PantryItem[];
  plan: MealPlanEntry[];
  ready: boolean;
  toggleFavorite: (id: string) => void;
  toggleShopping: (id: string) => void;
  addShoppingItem: (item: ShoppingItem) => void;
  removeShoppingItem: (id: string) => void;
  addIngredientsToShopping: (recipe: Recipe, servings?: number) => void;
  buildWeeklyShopping: () => void;
  setPlanRecipe: (day: number, recipeId?: string) => void;
  addRecipe: (recipe: Recipe) => void;
  addPantryItem: (item: PantryItem) => void;
};

const AppStateContext = createContext<State | null>(null);
const KEY = 'cookmate.state.v1';

type StoredState = Pick<State, 'recipes' | 'shopping' | 'pantry' | 'plan'>;

export function AppStateProvider({ children }: PropsWithChildren) {
  const [recipes, setRecipes] = useState<Recipe[]>(seedRecipes);
  const [shopping, setShopping] = useState<ShoppingItem[]>(initialShopping);
  const [pantry, setPantry] = useState<PantryItem[]>(initialPantry);
  const [plan, setPlan] = useState<MealPlanEntry[]>(initialPlan);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await Storage.getItem(KEY);
        if (raw) {
          const saved = JSON.parse(raw) as StoredState;
          if (saved.recipes?.length) setRecipes(saved.recipes);
          if (saved.shopping) setShopping(saved.shopping);
          if (saved.pantry) setPantry(saved.pantry);
          if (saved.plan) setPlan(saved.plan);
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    Storage.setItem(KEY, JSON.stringify({ recipes, shopping, pantry, plan } satisfies StoredState));
  }, [recipes, shopping, pantry, plan, ready]);

  const addIngredientsToShopping = (recipe: Recipe, servings = recipe.servings) => {
    const factor = servings / recipe.servings;
    setShopping(current => {
      const next = [...current];
      for (const ingredient of recipe.ingredients) {
        const amount = ingredient.amount * factor;
        const existingIndex = next.findIndex(i => i.name.toLowerCase() === ingredient.name.toLowerCase() && i.unit === ingredient.unit && !i.done);
        if (existingIndex >= 0) {
          const existing = next[existingIndex];
          next[existingIndex] = {
            ...existing,
            amount: existing.amount + amount,
            sourceRecipeIds: Array.from(new Set([...(existing.sourceRecipeIds ?? []), recipe.id]))
          };
        } else {
          next.push({ ...ingredient, id: `${ingredient.id}-${Date.now()}-${Math.random()}`, amount, done: false, sourceRecipeIds: [recipe.id] });
        }
      }
      return next;
    });
  };

  const value = useMemo<State>(() => ({
    recipes,
    shopping,
    pantry,
    plan,
    ready,
    toggleFavorite: id => setRecipes(rs => rs.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r)),
    toggleShopping: id => setShopping(items => items.map(i => i.id === id ? { ...i, done: !i.done } : i)),
    addShoppingItem: item => setShopping(items => [...items, item]),
    removeShoppingItem: id => setShopping(items => items.filter(i => i.id !== id)),
    addIngredientsToShopping,
    buildWeeklyShopping: () => {
      const selected = plan.map(p => recipes.find(r => r.id === p.recipeId)).filter(Boolean) as Recipe[];
      selected.forEach(recipe => addIngredientsToShopping(recipe));
    },
    setPlanRecipe: (day, recipeId) => setPlan(entries => entries.map(e => e.day === day ? { ...e, recipeId } : e)),
    addRecipe: recipe => setRecipes(rs => [recipe, ...rs]),
    addPantryItem: item => setPantry(items => [...items, item])
  }), [recipes, shopping, pantry, plan, ready]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = React.use(AppStateContext);
  if (!value) throw new Error('useAppState must be used inside AppStateProvider');
  return value;
}
