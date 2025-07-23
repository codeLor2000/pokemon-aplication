import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'pokemon',
    canActivate: [authGuard],
    children: [
      {
        path: 'list',
        loadComponent: () => import('./features/pokemon/pokemon-list/pokemon-list.component').then(m => m.PokemonListComponent)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./features/pokemon/favorites/favorites.component').then(m => m.FavoritesComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
