import { Recipe } from '@/types/models';

function firstRecipeNode(value: unknown): any | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = firstRecipeNode(item);
      if (found) return found;
    }
    return null;
  }
  if (typeof value !== 'object') return null;
  const obj = value as Record<string, unknown>;
  const type = obj['@type'];
  if (type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'))) return obj;
  if (obj['@graph']) return firstRecipeNode(obj['@graph']);
  return null;
}

function parseDuration(value?: string): number {
  if (!value) return 30;
  const h = /([0-9]+)H/.exec(value)?.[1];
  const m = /([0-9]+)M/.exec(value)?.[1];
  return (Number(h || 0) * 60) + Number(m || 0) || 30;
}

export async function importRecipeFromUrl(url: string): Promise<Recipe> {
  const res = await fetch(url, { headers: { Accept: 'text/html' } });
  if (!res.ok) throw new Error(`Seite konnte nicht geladen werden (${res.status}).`);
  const html = await res.text();
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  let node: any | null = null;
  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script[1]);
      node = firstRecipeNode(parsed);
      if (node) break;
    } catch {}
  }
  if (!node) throw new Error('Auf der Seite wurde kein Schema.org-Rezept gefunden.');
  const rawIngredients: string[] = Array.isArray(node.recipeIngredient) ? node.recipeIngredient : [];
  const rawInstructions = Array.isArray(node.recipeInstructions) ? node.recipeInstructions : [];
  const steps = rawInstructions.map((step: any, index: number) => ({
    id: `step-${Date.now()}-${index}`,
    text: typeof step === 'string' ? step : String(step?.text || step?.name || '')
  })).filter((s: { text: string }) => s.text.trim().length > 0);
  const ingredients = rawIngredients.map((text, index) => ({
    id: `ingredient-${Date.now()}-${index}`,
    name: text,
    amount: 1,
    unit: '',
    category: 'Sonstiges'
  }));
  return {
    id: `import-${Date.now()}`,
    title: String(node.name || 'Importiertes Rezept'),
    description: String(node.description || 'Von einer Webseite importiert.'),
    minutes: parseDuration(node.totalTime || node.cookTime || node.prepTime),
    difficulty: 'Einfach',
    servings: Number.parseInt(String(node.recipeYield || 4), 10) || 4,
    category: 'Importiert',
    imageKey: 'carbonara',
    ingredients,
    steps: steps.length ? steps : [{ id: `step-${Date.now()}`, text: 'Zubereitung auf der Originalseite ansehen.' }]
  };
}
