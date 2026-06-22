import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private enrutador: Router) {}

  ingresar() {
    if (this.usuarioInput === '' || this.passInput === '') {
      alert('Por favor complete todos los campos.');
      return;
    }

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
    }
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