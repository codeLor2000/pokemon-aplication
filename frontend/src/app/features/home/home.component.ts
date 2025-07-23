import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { PokemonService, Pokemon } from '../../core/services/pokemon.service';
import { AuthService } from '../../core/services/auth.service';
import { PokemonDetailModalComponent } from '../pokemon/pokemon-detail-modal/pokemon-detail-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pokemonList: Pokemon[] = [];

  // Track current dialog to ensure only one is open
  private currentDialogRef: MatDialogRef<PokemonDetailModalComponent> | null = null;

  // Featured Pokémon YouTube videos
  pokemonVideos = [
    {
      id: 1,
      videoId: 'D0zYJ1RQ-fs',
      title: 'Pokémon Origins Trailer',
      description: 'Experience the classic Pokémon story reimagined'
    },
    {
      id: 2,
      videoId: 'bILE5BEyhdo',
      title: 'Pokémon GO Official Trailer',
      description: 'The world around you is the world of Pokémon'
    },
    {
      id: 3,
      videoId: 'PSiAu3B2SmI',
      title: 'Pokémon Legends Arceus',
      description: 'A new era of Pokémon begins'
    },
    {
      id: 4,
      videoId: 'TmWu-f6L0Mo',
      title: 'Detective Pikachu Trailer',
      description: 'The first live-action Pokémon movie'
    }
  ];

  constructor(
    public readonly pokemonService: PokemonService,
    public readonly authService: AuthService,
    private readonly sanitizer: DomSanitizer,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadFirstTenPokemon();
  }

  /**
   * Get sanitized YouTube URL for iframe
   */
  getSanitizedUrl(videoId: string): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private loadFirstTenPokemon(): void {
    this.pokemonService.getFirstTen().subscribe({
      next: (pokemon) => {
        this.pokemonList = pokemon;
      },
      error: (error) => {
        console.error('Error loading Pokemon:', error);
        this.pokemonList = [];
      }
    });
  }

  viewPokemonDetails(pokemon: Pokemon): void {
    console.log('🏠 Home: Opening Pokemon detail modal for:', pokemon.name);
    
    // Close any existing dialog first
    if (this.currentDialogRef) {
      console.log('🔄 Home: Closing previous dialog for new Pokemon:', pokemon.name);
      this.currentDialogRef.close();
      this.currentDialogRef = null;
    }
    
    try {
      // Angular Material dialog configuration for centered popup
      this.currentDialogRef = this.dialog.open(PokemonDetailModalComponent, {
        data: pokemon,
        width: '90vw',
        maxWidth: '600px',
        maxHeight: '90vh',
        autoFocus: false,
        disableClose: false,
        hasBackdrop: true,
        backdropClass: 'pokemon-dialog-backdrop',
        panelClass: 'pokemon-dialog-panel',
        position: {
          // Center the dialog
        },
        // Animation configuration
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '200ms'
      });
      
      console.log('✅ Home: Dialog opened successfully:', this.currentDialogRef);
      
      this.currentDialogRef.afterOpened().subscribe(() => {
        console.log('🎉 Home: Dialog afterOpened event fired for:', pokemon.name);
      });
      
      this.currentDialogRef.afterClosed().subscribe(result => {
        console.log('🔔 Home: Dialog closed for:', pokemon.name, result);
        this.currentDialogRef = null; // Clear reference when closed
      });
      
    } catch (error) {
      console.error('❌ Home: Error opening dialog:', error);
    }
  }
} 