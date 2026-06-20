import { Routes } from '@angular/router';
import { Formulario } from './formulario/formulario';
import { ListaTicket } from './lista-ticket/lista-ticket';

export const rutas: Routes = [
  
  { path: 'incidentes', component: ListaTicket},  
  { path: 'nuevo', component: Formulario},
  { path: 'editar/:id', component: Formulario },
  
  // Ruta por defecto: si entra vacio lo redirigimos a los incidentes, luego veo si lo cambio
  { path: '', redirectTo: '/incidentes', pathMatch: 'full' } 
];