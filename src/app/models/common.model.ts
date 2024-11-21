// Base interface for entities with common properties
interface Entity {
    name: string;
    code: string;
}

// Ink and Rarity inherit from Entity
export interface Ink extends Entity {}
export interface Rarity extends Entity {}

// Main CardResponse interface
export interface CardResponse {
    id: string;
    name: string;
    version: string;
    layout: string;
    released_at: string;
    image_uris: ImageUris;
    cost: number;
    inkwell: boolean;
    ink: string; // Can be linked to Ink name
    type: string[];
    classifications: string[];
    text: string;
    keywords: string[];
    move_cost: number | null;
    strength: number;
    willpower: number;
    lore: number;
    rarity: string; // Can be linked to Rarity name
    illustrators: string[];
    collector_number: string;
    lang: string;
    flavor_text: string;
    tcgplayer_id: number;
    legalities: Legalities;
    set: SetDetail; // Uses SetDetail for additional properties
    prices: Prices;
}

// Image URIs structure
export interface ImageUris {
    digital: DigitalImageUris;
}

// Digital image variants
export interface DigitalImageUris {
    small: string;
    normal: string;
    large: string;
}

// Legalities information
export interface Legalities {
    core: string;
}

// SetDetail with extended properties
export interface SetDetail extends Entity {
    id: string;
    released_at?: string;
    prereleased_at?: string;
}

// Prices structure
export interface Prices {
    usd: string;
    usd_foil: string;
}
