import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore'; // herramienta de la base de datos (Firestore)

@Injectable({
  providedIn: 'root' //"disponible en...."
})
export class AutenticacionService {

  
  constructor(// Inyecto bd (firestore) ademas del Auth
    private authFirebase: Auth,
    private baseDeDatos: Firestore
  ) { }
  ingresarConFirebase(correoRecibido: string, claveRecibida: string) {
    return signInWithEmailAndPassword(this.authFirebase, correoRecibido, claveRecibida);//signInWithEmailAndPassword metodo puro de google firebase
  }

  // #Dir2
  async obtenerRolDeBaseDeDatos(uidUsuario: string) { //funcion para ir a buscar el rol a la coleccion "usuarios"
    
    const referenciaDocumento = doc(this.baseDeDatos, 'usuarios', uidUsuario);// 'doc' arma la ruta exacta, o sea: "va a la carpeta 'usuarios' y busca el archivo llamado OPKNI2I3..."
    const documento = await getDoc(referenciaDocumento);// 'getDoc' va y lee lo que dice adentro de ese archivo
    
    if (documento.exists()) {
      return documento.data()['rol']; // devuelve el texto 'admin' o 'user'
    } else {
      return 'user'; // por default si el usuario no tiene rol guardado, es 'user' por segguridad
    }
  }

}

