import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, QueryParamsHandling } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { PokemonService, Pokemon, PokemonSearchParams } from '../../../core/services/pokemon.service';
import { PokemonDetailModalComponent } from '../pokemon-detail-modal/pokemon-detail-modal.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatExpansionModule
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  searchForm: FormGroup;
  pokemonList: Pokemon[] = [];
  pokemonTypes: string[] = [];
  totalCount = 0;
  currentPage = 1;
  pageSize = 20;
  hasSearched = false;
  isImporting = false;

  // Track current dialog to ensure only one is open
  private currentDialogRef: MatDialogRef<PokemonDetailModalComponent> | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly pokemonService: PokemonService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {
    this.searchForm = this.formBuilder.group({
      name: [''],
      type: [''],
      legendary: [false],
      minSpeed: [''],
      maxSpeed: ['']
    });
  }

  ngOnInit(): void {
    this.setupSearchSubscription();
    this.loadPokemonTypes();
    this.loadQueryParams();
    this.searchPokemon();
  }

  ngOnDestroy(): void {
    // Close any open dialog when component is destroyed
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
      this.currentDialogRef = null;
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchSubscription(): void {
    // Debounce name search
    this.searchForm.get('name')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.searchPokemon();
      });
  }

  private loadPokemonTypes(): void {
    this.pokemonService.getPokemonTypes().subscribe({
      next: (types) => {
        this.pokemonTypes = types;
      },
      error: (error) => {
        console.error('Error loading Pokemon types:', error);
      }
    });
  }

  private loadQueryParams(): void {
    const params = this.route.snapshot.queryParams;
    if (Object.keys(params).length > 0) {
      this.searchForm.patchValue({
        name: params['name'] || '',
        type: params['type'] || '',
        legendary: params['legendary'] === 'true',
        minSpeed: params['minSpeed'] || '',
        maxSpeed: params['maxSpeed'] || ''
      });
      this.currentPage = parseInt(params['page']) || 1;
      this.pageSize = parseInt(params['limit']) || 20;
    }
  }

  searchPokemon(): void {
    const formValue = this.searchForm.value;
    const searchParams: PokemonSearchParams = {
      ...formValue,
      page: this.currentPage,
      limit: this.pageSize
    };

    // Remove empty values
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key as keyof PokemonSearchParams] === '' || 
          searchParams[key as keyof PokemonSearchParams] === null ||
          searchParams[key as keyof PokemonSearchParams] === undefined) {
        delete searchParams[key as keyof PokemonSearchParams];
      }
    });

    this.updateUrlParams(searchParams);
    this.hasSearched = true;

    this.pokemonService.searchPokemon(searchParams).subscribe({
      next: (response) => {
        this.pokemonList = response.data;
        this.totalCount = response.total;
      },
      error: (error) => {
        console.error('Error searching Pokemon:', error);
        this.snackBar.open('Error loading Pokémon data', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.searchPokemon();
  }

  clearFilters(): void {
    this.searchForm.reset({
      name: '',
      type: '',
      legendary: false,
      minSpeed: '',
      maxSpeed: ''
    });
    this.currentPage = 1;
    this.searchPokemon();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.searchPokemon();
  }

  changePageSize(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.searchPokemon();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.importCsvFile(file);
    }
  }

  private importCsvFile(file: File): void {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.snackBar.open('Please select a CSV file', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isImporting = true;

    this.pokemonService.importFromCsv(file).subscribe({
      next: (response) => {
        this.isImporting = false;
        this.snackBar.open(response.message, 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        
        // Reload the data
        this.searchPokemon();
        
        // Reset file input
        this.fileInput.nativeElement.value = '';
      },
      error: (error) => {
        this.isImporting = false;
        const errorMessage = error.error?.message || 'Import failed. Please try again.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        
        // Reset file input
        this.fileInput.nativeElement.value = '';
      }
    });
  }

  testDialog(): void {
    console.log('🧪 Testing dialog with sample data...');
    
    // Close any existing dialog first
    if (this.currentDialogRef) {
      console.log('🔄 Closing previous dialog...');
      this.currentDialogRef.close();
      this.currentDialogRef = null;
    }
    
    const samplePokemon: Pokemon = {
      id: 1,
      name: 'Bulbasaur',
      type1: 'Grass',
      type2: 'Poison',
      total: 318,
      hp: 45,
      attack: 49,
      defense: 49,
      spAttack: 65,
      spDefense: 65,
      speed: 45,
      generation: 1,
      legendary: false,
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      // Angular Material dialog configuration for centered popup
      this.currentDialogRef = this.dialog.open(PokemonDetailModalComponent, {
        data: samplePokemon,
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
      
      console.log('✅ Test dialog opened successfully:', this.currentDialogRef);
      
      this.currentDialogRef.afterOpened().subscribe(() => {
        console.log('🎉 Dialog afterOpened event fired!');
      });
      
      this.currentDialogRef.afterClosed().subscribe(result => {
        console.log('🔔 Dialog afterClosed event fired:', result);
        this.currentDialogRef = null; // Clear reference when closed
      });
      
    } catch (error) {
      console.error('❌ Error opening test dialog:', error);
      alert('❌ Error: ' + (error as Error).message);
    }
  }

  viewPokemonDetails(pokemon: Pokemon): void {
    console.log('🎯 Opening Pokemon detail modal for:', pokemon.name);
    
    // Close any existing dialog first
    if (this.currentDialogRef) {
      console.log('🔄 Closing previous dialog for new Pokemon:', pokemon.name);
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
      
      console.log('✅ Dialog opened successfully:', this.currentDialogRef);
      
      this.currentDialogRef.afterOpened().subscribe(() => {
        console.log('🎉 Dialog afterOpened event fired for:', pokemon.name);
      });
      
      this.currentDialogRef.afterClosed().subscribe(result => {
        console.log('🔔 Dialog closed for:', pokemon.name, result);
        this.currentDialogRef = null; // Clear reference when closed
      });
      
    } catch (error) {
      console.error('❌ Error opening dialog:', error);
      alert('❌ Error opening popup: ' + (error as Error).message);
    }
  }

  private updateUrlParams(params: PokemonSearchParams): void {
    const queryParams: any = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams[key] = value;
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true
    });
  }
} 