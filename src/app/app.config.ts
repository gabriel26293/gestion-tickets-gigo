import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { rutas } from './app.routes';

//importaciones de firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(rutas),

    // Enciendo Firebase con el mis datos en el proyecto (lo saque del codigo que me da firebase)
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyCgEgIifjLxYYI5EhqU_9HVSfPcon6zlSk",
      authDomain: "gigo-helpdesk.firebaseapp.com",
      projectId: "gigo-helpdesk",
      storageBucket: "gigo-helpdesk.firebasestorage.app",
      messagingSenderId: "322874812094",
      appId: "1:322874812094:web:defb9b57f088d4d1d4e0ef"
    })),
    // Arranco el modulo de autenticacion (Login) luego lo uso en autenticacion.ts
    provideAuth(() => getAuth()),

    // arranco la BD (Para el foro y los tickets mas adelante vere....)
    provideFirestore(() => getFirestore())
  ]
};
