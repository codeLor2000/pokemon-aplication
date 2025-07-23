import { Routes } from '@angular/router';

export const pokemonRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./pokemon-list/pokemon-list.component').then(c => c.PokemonListComponent)
  }
]; 