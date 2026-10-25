import { Routes } from '@angular/router';
import { Formulario } from './formulario/formulario';
import { ListaTicket } from './lista-ticket/lista-ticket';
import { LoginComponent } from './login/login';
import { authGuard } from './guardianes/auth-guard';//#DIR4 importo al patova implementado en auth-guard.ts
import { DetalleTicket } from './detalle-ticket/detalle-ticket';//DIR18 MEJORA PARA ver/consultar DE TICKETS 
import { DashboardComponent } from './dashboard/dashboard'; // #DIR22 ajusto ruta

export const rutas: Routes = [
  
  { path: 'login', component: LoginComponent },
  //{ path: 'incidentes', component: ListaTicket},  
  //{ path: 'nuevo', component: Formulario},
  //{ path: 'editar/:id', component: Formulario },
  //{path: 'incidentes'}, 
  
    // #DIR4 Le agregO el canActivate: [authGuard] a las rutas privadas para proteger ... hacer lo mismo con las demas rutas que quiero proteger
  { path: 'incidentes', component: ListaTicket, canActivate: [authGuard] },
  { path: 'nuevo', component: Formulario, canActivate: [authGuard] },
  { path: 'editar/:id', component: Formulario, canActivate: [authGuard] },
  //canActivate: [authGuard] // con el canActive lo activo

  
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },// #DIR22 Agrego la ruta del dashboard protegida

  { path: 'detalle/:id', component: DetalleTicket }, ////DIR18 MEJORA PARA EDICION DE TICKET
    

  // Ruta por defecto: si entra vacio lo redirigimos a los incidentes, luego veo si lo cambio
  { path: '', redirectTo: '/login', pathMatch: 'full' } 
];