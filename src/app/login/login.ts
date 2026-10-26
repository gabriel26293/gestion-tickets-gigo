import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../autenticacion/autenticacion.service'; //importo para validar con firebase

export interface Usuario {
  username: string;
  role: 'admin' | 'user';
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  usuarioInput: string = '';
  passInput: string = '';

  //constructor(private enrutador: Router) {}

  // Inyecto servicio (el "horno") junto con el enrutador
  constructor(
    private enrutador: Router,
    private servicioAuth: AutenticacionService 
  ) {}

  ingresar() {
    if (this.usuarioInput === '' || this.passInput === '') {
      alert('Por favor complete todos los campos.');
      return;
    }
    //DIR#1
    // Ya no harcodeo ni valido usuario con if, el login se convirtio en mensajero. Le mando los datos a firebase y que se arrelge.
    //uso this y then
    this.servicioAuth.ingresarConFirebase(this.usuarioInput, this.passInput)
      .then(async (respuestaDeFirebase) => { // Uso .then() para decir "CUANDO Firebase responda con exito.... que haga esto:...."
        // Si entro, es porque Firebase valido el usuario y la clave 
        // OJO: Por ahora dejo un usuario temporal hardcodeado SOLO para el LocalStorage. Mas adelante traigo el rol real desde firebase
        
        const uid = respuestaDeFirebase.user.uid; //guardo en uid. me devuelve el paquete junto con el id dentro de "respuestaDeFirebase" viene el UID del usuario
        /*hardcodeo viejo
        const usuarioTemporal: Usuario = { username: this.usuarioInput, role: 'admin' };
        localStorage.setItem('sesion_usuario', JSON.stringify(usuarioTemporal));      
        */
       // DIR#2
        const rolReal = await this.servicioAuth.obtenerRolDeBaseDeDatos(uid); // ya entro, lo freno un segundo (await) y mandao a buscar su rol real a firestore       
        const usuarioReal: Usuario = { // guardo usuario real con su rol posta 
          username: this.usuarioInput, 
          role: rolReal as 'admin' | 'user' //fuerzo con as el tipado para que typescript no rompa porque en la linea 6 defino una interfaz con tipo de datosstring
        };

        localStorage.setItem('sesion_usuario', JSON.stringify(usuarioReal));
        
        this.enrutador.navigate(['/incidentes']);// grilla de incidentes
      })
      .catch((errorDeFirebase) => {
        // uso ".catch()" para atrapr cualquier error (ej. pass erronea, usuario invalido)
        alert('Credenciales incorrectas o usuario inexistente.'); 
      });

    /*codigo viejo validaba usuario harcodeado

    let usuarioEncontrado: Usuario | null = null; // por ahora nulo

    // Damos de alta los usuarios mas adelante lo hacemos com el xamp y mysql
    if (this.usuarioInput === 'admin' && this.passInput === 'admin123') {
      usuarioEncontrado = { username: 'admin', role: 'admin' };
    } else if (this.usuarioInput === 'ggomez' && this.passInput === '1234') {
      usuarioEncontrado = { username: 'ggomez', role: 'user' };
    } else if (this.usuarioInput === 'tgianella' && this.passInput === '1234') {
      usuarioEncontrado = { username: 'tgianella', role: 'user' };
    }
    
    if (usuarioEncontrado !== null) { // si existe guardo
      localStorage.setItem('sesion_usuario', JSON.stringify(usuarioEncontrado));      
      this.enrutador.navigate(['/incidentes']);//nos manda a incidentes
    } else {
      alert('Credenciales incorrectas.'); 
    }*/
  }


  /*
  ingresar() {
    if (this.usuarioInput === '' || this.passInput === '') {
      alert('Por favor complete todos los campos.');
      return;
    }

    let usuarioEncontrado: Usuario | null = null;//por ahora nulo, lo dejamos asi

    // hardcodeamos
    if (this.usuarioInput === 'admin' && this.passInput === 'admin123') {
      usuarioEncontrado = { username: 'admin', role: 'admin' };
    } else if (this.usuarioInput === 'user' && this.passInput === 'user123') {
      usuarioEncontrado = { username: 'user', role: 'user' };
    }

    
    if (usuarioEncontrado !== null) { //si existe guardo
      localStorage.setItem('sesion_usuario', JSON.stringify(usuarioEncontrado));      
      this.enrutador.navigate(['/incidentes']);
    } else {
      alert('Credenciales incorrectas. Pruebe admin/admin123 o user/user123');//lo dejamos por ahora
    }
  }
  */

}