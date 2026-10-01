export const ALLERGENS = ['G', 'L', 'VL', 'M', 'Veg'] as const;

export type Allergen = (typeof ALLERGENS)[number];
