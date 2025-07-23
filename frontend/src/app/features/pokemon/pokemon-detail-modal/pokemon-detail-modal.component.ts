import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Pokemon } from '../../../core/services/pokemon.service';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-pokemon-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatCardModule,
    MatListModule,
    MatBadgeModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  templateUrl: './pokemon-detail-modal.component.html',
  styleUrls: ['./pokemon-detail-modal.component.scss']
})
export class PokemonDetailModalComponent implements OnInit {
  isFavorite: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PokemonDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Pokemon,
    private favoritesService: FavoritesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isFavorite = this.favoritesService.isFavorite(this.data.id);
  }

  close(): void {
    this.dialogRef.close();
  }

  toggleFavorite(): void {
    const success = this.favoritesService.toggleFavorite(this.data);
    
    if (this.isFavorite) {
      // Was favorite, now removed
      this.snackBar.open(`${this.data.name} removed from favorites!`, 'Close', { 
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    } else {
      // Wasn't favorite, now added
      this.snackBar.open(`${this.data.name} added to favorites!`, 'Close', { 
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
    
    // Update local state
    this.isFavorite = this.favoritesService.isFavorite(this.data.id);
  }

  getStatPercentage(stat: number): number {
    // Assuming max stat is around 255 for percentage calculation
    return Math.min((stat / 255) * 100, 100);
  }
} 