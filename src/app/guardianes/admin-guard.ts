import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../autenticacion/autenticacion.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const servicioAuth = inject(AutenticacionService);
  const enrutador = inject(Router);

  if (servicioAuth.esAdmin()) {
    return true; // Tiene permisos, lo deja pasar
  } else {
    enrutador.navigate(['/incidentes']); // No es admin, lo patea al inicio
    return false;
  }
};