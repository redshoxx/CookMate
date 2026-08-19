import { MealPlanEntry, PantryItem, Recipe, ShoppingItem } from '@/types/models';

export const recipes: Recipe[] = [
  {
    id: 'carbonara',
    title: 'Spaghetti Carbonara',
    description: 'Cremige Pasta mit Speck, Ei und Parmesan. Ein italienischer Klassiker.',
    minutes: 25,
    difficulty: 'Einfach',
    servings: 4,
    category: 'Pasta',
    imageKey: 'carbonara',
    ingredients: [
      { id: 'spaghetti', name: 'Spaghetti', amount: 500, unit: 'g', category: 'Sonstiges' },
      { id: 'speck', name: 'Speck', amount: 200, unit: 'g', category: 'Fleisch' },
      { id: 'eier', name: 'Eier', amount: 4, unit: 'Stk.', category: 'Sonstiges' },
      { id: 'parmesan', name: 'Parmesan', amount: 100, unit: 'g', category: 'Milchprodukte' },
      { id: 'salz', name: 'Salz & Pfeffer', amount: 1, unit: 'Prise', category: 'Sonstiges' }
    ],
    steps: [
      { id: 'c1', text: 'Spaghetti in reichlich Salzwasser bissfest kochen.' },
      { id: 'c2', text: 'Speck in einer Pfanne knusprig anbraten.', timerSeconds: 300 },
      { id: 'c3', text: 'Eier mit fein geriebenem Parmesan verrühren.' },
      { id: 'c4', text: 'Etwas Nudelwasser zur Eiermischung geben und verrühren.' },
      { id: 'c5', text: 'Pasta zum Speck geben, Pfanne von der Hitze nehmen und Eiermischung unterheben.' },
      { id: 'c6', text: 'Mit Pfeffer abschmecken und sofort servieren.' }
    ],
    favorite: true
  },
  {
    id: 'curry', title: 'Hähnchen Curry', description: 'Cremiges Curry mit Hähnchen und Gemüse.', minutes: 35, difficulty: 'Einfach', servings: 4, category: 'Fleisch', imageKey: 'curry',
    ingredients: [
      { id: 'chicken', name: 'Hähnchenfilet', amount: 500, unit: 'g', category: 'Fleisch' },
      { id: 'rice', name: 'Reis', amount: 300, unit: 'g', category: 'Sonstiges' },
      { id: 'coconut', name: 'Kokosmilch', amount: 400, unit: 'ml', category: 'Sonstiges' },
      { id: 'onion', name: 'Zwiebeln', amount: 2, unit: 'Stk.', category: 'Obst & Gemüse' }
    ],
    steps: [
      { id: 'cu1', text: 'Reis nach Packungsangabe kochen.' },
      { id: 'cu2', text: 'Hähnchen würfeln und kräftig anbraten.' },
      { id: 'cu3', text: 'Zwiebeln dazugeben und glasig werden lassen.' },
      { id: 'cu4', text: 'Mit Kokosmilch ablöschen, würzen und 12 Minuten köcheln.', timerSeconds: 720 }
    ]
  },
  {
    id: 'lasagne', title: 'Lasagne', description: 'Klassische Lasagne aus dem Ofen.', minutes: 40, difficulty: 'Mittel', servings: 4, category: 'Pasta', imageKey: 'lasagne',
    ingredients: [
      { id: 'lasagneplates', name: 'Lasagneblätter', amount: 1, unit: 'Pkg.', category: 'Sonstiges' },
      { id: 'mince', name: 'Faschiertes', amount: 500, unit: 'g', category: 'Fleisch' },
      { id: 'tomato-passata', name: 'Passierte Tomaten', amount: 500, unit: 'ml', category: 'Obst & Gemüse' }
    ],
    steps: [{ id: 'l1', text: 'Sauce kochen.' }, { id: 'l2', text: 'Lasagne schichten und backen.', timerSeconds: 2100 }]
  },
  {
    id: 'veggie', title: 'Veggie Bowl', description: 'Bunte Bowl mit Gemüse und Reis.', minutes: 20, difficulty: 'Einfach', servings: 2, category: 'Vegetarisch', imageKey: 'veggie',
    ingredients: [{ id: 'tomatoes', name: 'Tomaten', amount: 4, unit: 'Stk.', category: 'Obst & Gemüse' }, { id: 'rice2', name: 'Reis', amount: 180, unit: 'g', category: 'Sonstiges' }],
    steps: [{ id: 'v1', text: 'Reis kochen und Gemüse schneiden.' }, { id: 'v2', text: 'Alles in einer Schüssel anrichten.' }]
  },
  {
    id: 'chili', title: 'Chili con Carne', description: 'Würziges Chili für kalte Tage.', minutes: 30, difficulty: 'Einfach', servings: 4, category: 'Fleisch', imageKey: 'chili',
    ingredients: [{ id: 'mince2', name: 'Faschiertes', amount: 500, unit: 'g', category: 'Fleisch' }, { id: 'beans', name: 'Kidneybohnen', amount: 2, unit: 'Dose', category: 'Sonstiges' }],
    steps: [{ id: 'ch1', text: 'Faschiertes anbraten.' }, { id: 'ch2', text: 'Restliche Zutaten dazugeben und köcheln.', timerSeconds: 1200 }]
  },
  {
    id: 'pancakes', title: 'Pfannkuchen', description: 'Fluffige Pfannkuchen zum Frühstück.', minutes: 15, difficulty: 'Einfach', servings: 2, category: 'Frühstück', imageKey: 'pancakes',
    ingredients: [{ id: 'flour', name: 'Mehl', amount: 200, unit: 'g', category: 'Sonstiges' }, { id: 'milk', name: 'Milch', amount: 300, unit: 'ml', category: 'Milchprodukte' }, { id: 'eggs2', name: 'Eier', amount: 2, unit: 'Stk.', category: 'Sonstiges' }],
    steps: [{ id: 'p1', text: 'Teig verrühren.' }, { id: 'p2', text: 'Portionsweise goldbraun ausbacken.' }]
  },
  {
    id: 'burger', title: 'Burger', description: 'Saftiger Burger.', minutes: 25, difficulty: 'Einfach', servings: 2, category: 'Fleisch', imageKey: 'burger',
    ingredients: [{ id: 'buns', name: 'Burger Buns', amount: 2, unit: 'Stk.', category: 'Backwaren' }, { id: 'onion2', name: 'Zwiebeln', amount: 1, unit: 'Stk.', category: 'Obst & Gemüse' }],
    steps: [{ id: 'b1', text: 'Burger Patties braten und Burger zusammenbauen.' }]
  },
  {
    id: 'goulash', title: 'Gulasch', description: 'Herzhaftes Gulasch.', minutes: 80, difficulty: 'Mittel', servings: 4, category: 'Fleisch', imageKey: 'goulash',
    ingredients: [{ id: 'beef', name: 'Rindfleisch', amount: 700, unit: 'g', category: 'Fleisch' }, { id: 'onion3', name: 'Zwiebeln', amount: 3, unit: 'Stk.', category: 'Obst & Gemüse' }],
    steps: [{ id: 'g1', text: 'Zwiebeln langsam rösten.' }, { id: 'g2', text: 'Fleisch und Gewürze zugeben und weich schmoren.', timerSeconds: 3600 }]
  }
];

export const initialPlan: MealPlanEntry[] = [
  { day: 0, recipeId: 'carbonara' },
  { day: 1, recipeId: 'curry' },
  { day: 2 },
  { day: 3, recipeId: 'burger' },
  { day: 4, recipeId: 'lasagne' },
  { day: 5 },
  { day: 6, recipeId: 'goulash' }
];

export const initialShopping: ShoppingItem[] = [
  { id: 'tomaten-list', name: 'Tomaten', amount: 6, unit: 'Stk.', category: 'Obst & Gemüse', done: false },
  { id: 'zwiebeln-list', name: 'Zwiebeln', amount: 2, unit: 'Stk.', category: 'Obst & Gemüse', done: false },
  { id: 'parmesan-list', name: 'Parmesan', amount: 200, unit: 'g', category: 'Milchprodukte', done: false },
  { id: 'milch-list', name: 'Milch', amount: 1, unit: 'l', category: 'Milchprodukte', done: false },
  { id: 'chicken-list', name: 'Hähnchenfilet', amount: 500, unit: 'g', category: 'Fleisch', done: false },
  { id: 'spaghetti-list', name: 'Spaghetti', amount: 500, unit: 'g', category: 'Sonstiges', done: false },
  { id: 'eier-list', name: 'Eier', amount: 4, unit: 'Stk.', category: 'Sonstiges', done: false }
];

export const initialPantry: PantryItem[] = [
  { id: 'milk-pantry', name: 'Milch', amount: 1, unit: 'l', category: 'Milchprodukte', expiresAt: '2026-08-22' },
  { id: 'eggs-pantry', name: 'Eier', amount: 6, unit: 'Stk.', category: 'Sonstiges', minimum: 4 },
  { id: 'spaghetti-pantry', name: 'Spaghetti', amount: 2, unit: 'Pkg.', category: 'Sonstiges' },
  { id: 'parmesan-pantry', name: 'Parmesan', amount: 50, unit: 'g', category: 'Milchprodukte', minimum: 100 },
  { id: 'tomatoes-pantry', name: 'Tomaten', amount: 3, unit: 'Stk.', category: 'Obst & Gemüse' },
  { id: 'onion-pantry', name: 'Zwiebeln', amount: 2, unit: 'Stk.', category: 'Obst & Gemüse' }
];
