import { Component, OnInit } from '@angular/core'; //lo engancho con el import linea 4
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TicketService } from '../ticket.service'; 
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formulario.html'
})
export class Formulario implements OnInit {

  usuarioActual: string = ''; //para guardar el nombre logeado
  /*nuevoSolicitante: string = '';
  nuevoEquipo: string = '';
  nuevaDescripcion: string = '';*/

  //por ahora nuestro objeto lo llamamos ticketFormulario, despues vemos si hacemos cambios para escalarlo o lo consultamos con el profe
  ticketFormulario = new FormGroup({
    titulo: new FormControl('', Validators.required),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10)]),//otro obligatorio min 10 caractes por ahira
    tipo: new FormControl('Incidente', Validators.required),
    asignacion: new FormControl('Soporte Tecnico', Validators.required),
    categoria: new FormControl('Pc-Escritorio', Validators.required)
    //equipo: new FormControl(''),//opcional
    
  });

  //Si es mayor a 0 editamos. Si es 0 creamos
  idEdicion: number = 0; 

  constructor(
    private miServicio: TicketService,
    private rutaActiva: ActivatedRoute, // lee el numero de la url
    private enrutador: Router           // manda al usuario de vuelta a la tabla
  ) {}
    
  ngOnInit() {// Este metodo se ejecuta automaticamente un milisegundo despues de abrir la pantalla
    
    const sesion = localStorage.getItem('sesion_usuario');
    if (sesion !== null) { //buscamos el usuario para colocarlo en el label, con mysql esto ya ni llo usariamos
      this.usuarioActual = JSON.parse(sesion).username;
    }

    const idEnLaUrl = this.rutaActiva.snapshot.paramMap.get('id');// Leem la barra de direcciones buscando  "id"

    if (idEnLaUrl !== null) {
      
      this.idEdicion = Number(idEnLaUrl);

      const ticketAEditar = this.miServicio.obtenerTicketPorId(this.idEdicion);//busco ticket

      if (ticketAEditar !== undefined) { //si pasa el control autocompleta con react ;)
        this.ticketFormulario.setValue({
          titulo: ticketAEditar.titulo,
          descripcion: ticketAEditar.descripcion,
          tipo: ticketAEditar.tipo,
          asignacion: ticketAEditar.asignacion,
          categoria: ticketAEditar.categoria
        });
      }
    }
  }

    guardarTicket() {
    if (this.ticketFormulario.invalid) {
      alert("Por favor, complete correctamente los campos obligatorios.");
      return;  
    }

    const datos = this.ticketFormulario.value;

    if (this.idEdicion > 0) {//edicion
      this.miServicio.actualizarTicket(
        this.idEdicion,
        datos.titulo || '',  //pudimos usasr datos.titulo!
        datos.descripcion || '',
        datos.tipo || '',
        datos.asignacion || '',
        datos.categoria || ''
      );
      alert("¡Ticket actualizado con exito!");

    } else {//creacion
      this.miServicio.agregarTicket(
        this.usuarioActual,
        datos.titulo || '', 
        datos.descripcion || '',
        datos.tipo || '',
        datos.asignacion || '',
        datos.categoria || ''
      );
      alert("¡Ticket creado con exito!");
    }

    this.ticketFormulario.reset();
    
    this.enrutador.navigate(['/incidentes']);// lo mandamos a la tabla de incidentes
  }

  /*
  crearTicket() {
    
    if (this.ticketFormulario.invalid) {
      alert("Por favor, complete correctamente los campos obligatorios.");
      return;  
    }

    const datos = this.ticketFormulario.value;

    this.miServicio.agregarTicket(
      datos.solicitante!, // con "!" aseguro que el dato no es nulo o datos.solicitante || '',
      datos.equipo || 'Sin equipo', // por ahora si queda vacio le ponemos un texto por defecto
      datos.descripcion!
    );

    this.ticketFormulario.reset();

    alert("¡Ticket creado con éxito!");
  }
*/
  obtenerColorBoton() {
    if (this.ticketFormulario.invalid) {
      return '#bdc3c7'; // Grissdo 
    } else {
      return '#27ae60'; // Verde habilitado
    }
  }

  cancelar() {//cancelar accion por ahora al editar, uso enrutador ara volver a incidentes sin guardar
     this.enrutador.navigate(['/incidentes']);
  }

  /*bloque viejo hasta linea 60, usabamos variables auxiliares
  crearTicket() {
    if (this.nuevoSolicitante == '' || this.nuevaDescripcion == '') {
      alert("Por favor, complete los datos del solicitante y la descripcion.");
      return;  
    }
    this.miServicio.agregarTicket(this.nuevoSolicitante, this.nuevoEquipo, this.nuevaDescripcion);
    
    // Limpiamos los campos
    this.nuevoSolicitante = '';
    this.nuevoEquipo = '';
    this.nuevaDescripcion = '';
    
   
    alert("Ticket creado con éxito!");
  
  }
  */  
}