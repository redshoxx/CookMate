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
  resetState: () => void;
};

const AppStateContext = createContext<State | null>(null);
const KEY = 'cookmate.state.v1';

type StoredState = Pick<State, 'recipes' | 'shopping' | 'pantry' | 'plan'>;

function sameIngredient(a: ShoppingItem, name: string, unit: string) {
  return a.name.trim().toLowerCase() === name.trim().toLowerCase() && a.unit === unit;
}

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
      } catch {
        // Corrupt local state must never prevent the app from opening.
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    Storage.setItem(KEY, JSON.stringify({ recipes, shopping, pantry, plan } satisfies StoredState)).catch(() => {});
  }, [recipes, shopping, pantry, plan, ready]);

  const addIngredientsToShopping = (recipe: Recipe, servings = recipe.servings) => {
    const factor = Math.max(1, servings) / recipe.servings;
    setShopping(current => {
      const next = [...current];
      for (const ingredient of recipe.ingredients) {
        const amount = ingredient.amount * factor;
        const existingIndex = next.findIndex(item => !item.done && sameIngredient(item, ingredient.name, ingredient.unit));
        if (existingIndex >= 0) {
          const existing = next[existingIndex];
          next[existingIndex] = {
            ...existing,
            amount: existing.amount + amount,
            sourceRecipeIds: Array.from(new Set([...(existing.sourceRecipeIds ?? []), recipe.id]))
          };
        } else {
          next.push({
            ...ingredient,
            id: `${ingredient.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            amount,
            done: false,
            sourceRecipeIds: [recipe.id]
          });
        }
      }
      return next;
    });
  };

  const buildWeeklyShopping = () => {
    const selected = plan
      .map(entry => recipes.find(recipe => recipe.id === entry.recipeId))
      .filter(Boolean) as Recipe[];

    const generated: ShoppingItem[] = [];
    for (const recipe of selected) {
      for (const ingredient of recipe.ingredients) {
        const existing = generated.find(item => sameIngredient(item, ingredient.name, ingredient.unit));
        if (existing) {
          existing.amount += ingredient.amount;
          existing.sourceRecipeIds = Array.from(new Set([...(existing.sourceRecipeIds ?? []), recipe.id]));
        } else {
          generated.push({
            ...ingredient,
            id: `week-${ingredient.id}-${generated.length}`,
            done: false,
            sourceRecipeIds: [recipe.id]
          });
        }
      }
    }

    setShopping(current => {
      const customItems = current.filter(item => item.id.startsWith('custom-'));
      return [...customItems, ...generated];
    });
  };

  const value = useMemo<State>(() => ({
    recipes,
    shopping,
    pantry,
    plan,
    ready,
    toggleFavorite: id => setRecipes(items => items.map(recipe => recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe)),
    toggleShopping: id => setShopping(items => items.map(item => item.id === id ? { ...item, done: !item.done } : item)),
    addShoppingItem: item => setShopping(items => [...items, item]),
    removeShoppingItem: id => setShopping(items => items.filter(item => item.id !== id)),
    addIngredientsToShopping,
    buildWeeklyShopping,
    setPlanRecipe: (day, recipeId) => setPlan(entries => entries.map(entry => entry.day === day ? { ...entry, recipeId } : entry)),
    addRecipe: recipe => setRecipes(items => [recipe, ...items.filter(item => item.id !== recipe.id)]),
    addPantryItem: item => setPantry(items => [...items, item]),
    resetState: () => {
      setRecipes(seedRecipes);
      setShopping(initialShopping);
      setPantry(initialPantry);
      setPlan(initialPlan);
    }
  }), [recipes, shopping, pantry, plan, ready]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = React.use(AppStateContext);
  if (!value) throw new Error('useAppState must be used inside AppStateProvider');
  return value;
}
