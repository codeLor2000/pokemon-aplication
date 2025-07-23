import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { Subject, takeUntil } from 'rxjs';

import { FavoritesService, FavoritePokemon } from '../../../core/services/favorites.service';
import { PokemonDetailModalComponent } from '../pokemon-detail-modal/pokemon-detail-modal.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatBadgeModule
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: FavoritePokemon[] = [];
  isLoading = true;
  
  private destroy$ = new Subject<void>();

  constructor(
    private favoritesService: FavoritesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFavorites(): void {
    this.isLoading = true;
    
    this.favoritesService.getFavorites()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (favorites) => {
          this.favorites = this.favoritesService.getFavoritesSorted();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading favorites:', error);
          this.isLoading = false;
          this.snackBar.open('Error loading favorites', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  viewPokemonDetails(pokemon: any): void {
    this.dialog.open(PokemonDetailModalComponent, {
      data: pokemon,
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      backdropClass: 'pokemon-dialog-backdrop',
      panelClass: 'pokemon-dialog-panel'
    });
  }

  removeFavorite(event: Event, pokemonId: number): void {
    event.stopPropagation(); // Prevent card click
    
    const pokemon = this.favorites.find(f => f.pokemon.id === pokemonId);
    if (pokemon) {
      this.favoritesService.removeFromFavorites(pokemonId);
      this.snackBar.open(`${pokemon.pokemon.name} removed from favorites!`, 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }

  clearAllFavorites(): void {
    if (confirm('Are you sure you want to remove all Pokémon from favorites?')) {
      this.favoritesService.clearAllFavorites();
      this.snackBar.open('All favorites cleared!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'today';
    } else if (diffInDays === 1) {
      return 'yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }
} 