import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// DIR#4: Guardian de rutas (El Patovaa)... ver hoja de ruta
export const authGuard: CanActivateFn = (route, state) => {
    
  const enrutador = inject(Router); // no tengo un constructor normal, uso inject() para traer el enrutador por ahora...
  
 
  const sesionActiva = localStorage.getItem('sesion_usuario'); // Miro si la persona tiene sus credenciales guardados

  if (sesionActiva) {
    return true; // Pase ok
  } else {
    enrutador.navigate(['/login']); // NO! no tiene pase lo pateo de una al login
    return false; // Le bloqueamos la puerta
  }

//Nota:Falta decirle que rutas quiero proteger con el patova ir a > app.routes.ts  
};