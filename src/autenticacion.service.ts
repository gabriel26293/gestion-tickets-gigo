import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root' //"disponible en...."
})
export class AutenticacionService {

  constructor(private authFirebase: Auth) { }

  ingresarConFirebase(correoRecibido: string, claveRecibida: string) {
    return signInWithEmailAndPassword(this.authFirebase, correoRecibido, claveRecibida);
  }
}

//signInWithEmailAndPassword metodo puro de google firebase