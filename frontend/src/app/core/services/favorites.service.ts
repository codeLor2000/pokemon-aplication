import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pokemon } from './pokemon.service';

export interface FavoritePokemon {
  id: number;
  pokemon: Pokemon;
  addedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'pokemon_favorites';
  private favoritesSubject = new BehaviorSubject<FavoritePokemon[]>([]);
  
  constructor() {
    this.loadFavoritesFromStorage();
  }

  /**
   * Get favorites as observable
   */
  getFavorites(): Observable<FavoritePokemon[]> {
    return this.favoritesSubject.asObservable();
  }

  /**
   * Get current favorites array
   */
  getCurrentFavorites(): FavoritePokemon[] {
    return this.favoritesSubject.value;
  }

  /**
   * Check if Pokemon is in favorites
   */
  isFavorite(pokemonId: number): boolean {
    return this.getCurrentFavorites().some(fav => fav.pokemon.id === pokemonId);
  }

  /**
   * Add Pokemon to favorites
   */
  addToFavorites(pokemon: Pokemon): boolean {
    const currentFavorites = this.getCurrentFavorites();
    
    // Check if already exists
    if (this.isFavorite(pokemon.id)) {
      return false; // Already in favorites
    }

    const newFavorite: FavoritePokemon = {
      id: Date.now(), // Simple ID generation
      pokemon: pokemon,
      addedAt: new Date().toISOString()
    };

    const updatedFavorites = [...currentFavorites, newFavorite];
    this.updateFavorites(updatedFavorites);
    return true; // Successfully added
  }

  /**
   * Remove Pokemon from favorites
   */
  removeFromFavorites(pokemonId: number): boolean {
    const currentFavorites = this.getCurrentFavorites();
    const filteredFavorites = currentFavorites.filter(fav => fav.pokemon.id !== pokemonId);
    
    if (filteredFavorites.length < currentFavorites.length) {
      this.updateFavorites(filteredFavorites);
      return true; // Successfully removed
    }
    
    return false; // Not found in favorites
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite(pokemon: Pokemon): boolean {
    if (this.isFavorite(pokemon.id)) {
      return !this.removeFromFavorites(pokemon.id); // Return false if removed
    } else {
      return this.addToFavorites(pokemon); // Return true if added
    }
  }

  /**
   * Clear all favorites
   */
  clearAllFavorites(): void {
    this.updateFavorites([]);
  }

  /**
   * Get favorites count
   */
  getFavoritesCount(): number {
    return this.getCurrentFavorites().length;
  }

  /**
   * Get favorites sorted by date added (newest first)
   */
  getFavoritesSorted(): FavoritePokemon[] {
    return this.getCurrentFavorites().sort((a, b) => 
      new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );
  }

  private updateFavorites(favorites: FavoritePokemon[]): void {
    this.favoritesSubject.next(favorites);
    this.saveFavoritesToStorage(favorites);
  }

  private loadFavoritesFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const favorites: FavoritePokemon[] = JSON.parse(stored);
        this.favoritesSubject.next(favorites);
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      this.favoritesSubject.next([]);
    }
  }

  private saveFavoritesToStorage(favorites: FavoritePokemon[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }
} 