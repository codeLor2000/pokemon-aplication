import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Pokemon {
  id: number;
  name: string;
  type1: string;
  type2?: string;
  total: number;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  generation: number;
  legendary: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PokemonSearchParams {
  name?: string;
  type?: string;
  legendary?: boolean;
  minSpeed?: number;
  maxSpeed?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PokemonSearchResponse {
  data: Pokemon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ImportResponse {
  message: string;
  imported: number;
  errors: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly API_URL = 'http://localhost:3000/api/pokemon';

  // Signals for reactive state management
  private readonly pokemonListSignal = signal<Pokemon[]>([]);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly totalCountSignal = signal<number>(0);

  // Public computed signals
  readonly pokemonList = this.pokemonListSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly totalCount = this.totalCountSignal.asReadonly();

  constructor(private readonly http: HttpClient) {}

  /**
   * Get first 10 Pokemon for home page
   */
  getFirstTen(): Observable<Pokemon[]> {
    this.isLoadingSignal.set(true);

    return this.http.get<Pokemon[]>(`${this.API_URL}/first-ten`).pipe(
      tap(pokemon => {
        this.pokemonListSignal.set(pokemon);
        this.isLoadingSignal.set(false);
      })
    );
  }

  /**
   * Search Pokemon with filters and pagination
   */
  searchPokemon(params: PokemonSearchParams): Observable<PokemonSearchResponse> {
    this.isLoadingSignal.set(true);

    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<PokemonSearchResponse>(`${this.API_URL}/search`, { params: httpParams }).pipe(
      tap(response => {
        this.pokemonListSignal.set(response.data);
        this.totalCountSignal.set(response.total);
        this.isLoadingSignal.set(false);
      })
    );
  }

  /**
   * Get Pokemon by ID
   */
  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.API_URL}/${id}`);
  }

  /**
   * Get all available Pokemon types
   */
  getPokemonTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/types`);
  }

  /**
   * Import Pokemon from CSV file
   */
  importFromCsv(file: File): Observable<ImportResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ImportResponse>(`${this.API_URL}/import`, formData);
  }

  /**
   * Get Pokemon count
   */
  getPokemonCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.API_URL}/count`);
  }

  /**
   * Clear all Pokemon (admin function)
   */
  clearAllPokemon(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/clear-all`, {});
  }

  /**
   * Update Pokemon list signal manually
   */
  updatePokemonList(pokemon: Pokemon[]): void {
    this.pokemonListSignal.set(pokemon);
  }

  /**
   * Clear Pokemon list
   */
  clearPokemonList(): void {
    this.pokemonListSignal.set([]);
    this.totalCountSignal.set(0);
  }
} 