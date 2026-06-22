import { Injectable } from '@angular/core';

export interface Ticket{
  id_ticket: number;
  solicitante: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  asignacion: string;
  categoria: string;
  abierto: boolean;
  fechaCreacion: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TicketService {

  listaTickets: Ticket[] = [];
  contadorId: number;
/*hardcodeo 
  listaTickets: Ticket[] = [
    {
    id_ticket: 1,
    solicitante: "Francisco Perez",
    descripcion: "Pc no enciende",
    equipoAsignado: "Notebook #123",
    abierto: true,
    fechaCreacion: new Date ('2026-06-04T18:35:25'),
    }
  ];
  */
  

  // usamos el constructor para darle el valor inicial usando if/else y controlar los id de la lista
  constructor() {
    
    const ticketsGuardados = localStorage.getItem('tickets_gigo');//obtengo los tickets

    if (ticketsGuardados !== null) {
      this.listaTickets = JSON.parse(ticketsGuardados);//si los hay por ahora los transformamos a texto asi despues vemos...
    }

     if (this.listaTickets.length > 0) {
      
      const todosLosIds = this.listaTickets.map(ticket => ticket.id_ticket);      
      
      const idMasAlto = Math.max(...todosLosIds);      
      
      this.contadorId = idMasAlto + 1;
      
    } else {      
       this.contadorId = 1;      
      }
  }

  //al mudar la creacion a service no puedo leer pantalla entonces paso datos por parametros  
  agregarTicket(solicitanteIngresado: string, tituloIngresado: string, descripcionIngresada: string, tipoIngresado: string, asignacionIngresada: string, categoriaIngresada: string) {
    const nuevoIncidente: Ticket = {
      id_ticket: this.contadorId,
      solicitante: solicitanteIngresado,
      titulo: tituloIngresado,
      descripcion: descripcionIngresada,
      tipo: tipoIngresado,
      asignacion: asignacionIngresada,
      categoria: categoriaIngresada,
      abierto: true,
      fechaCreacion: new Date(),
    };
    
    this.listaTickets.push(nuevoIncidente);
    this.contadorId++;
    this.guardarEnStorage();
  }

  resolverTicket(idBuscado: number) {
    const ticketEncontrado = this.listaTickets.find(ticket => ticket.id_ticket === idBuscado);
    if (ticketEncontrado) {
      ticketEncontrado.abierto = false;
    }
    this.guardarEnStorage();
  }

  eliminarTicket(id_ticket_buscado: number) {
    this.listaTickets = this.listaTickets.filter(ticket => ticket.id_ticket !== id_ticket_buscado);
    this.guardarEnStorage();
  }

  //busco ticket por id
  obtenerTicketPorId(idBuscado: number) {
    return this.listaTickets.find(ticket => ticket.id_ticket === idBuscado);
  }

  // Pasa los datos nuevos y sobrescribe los viejos
  actualizarTicket(idBuscado: number, tituloNuevo: string, descripcionNueva: string, tipoNuevo: string, asignacionNueva: string, categoriaNueva: string) {
    const ticketEncontrado = this.obtenerTicketPorId(idBuscado);
    
    //valido
    if (ticketEncontrado) {
      ticketEncontrado.titulo = tituloNuevo;
      ticketEncontrado.descripcion = descripcionNueva;
      ticketEncontrado.tipo = tipoNuevo;
      ticketEncontrado.asignacion = asignacionNueva;
      ticketEncontrado.categoria = categoriaNueva;
    }
    this.guardarEnStorage();
  }

  private guardarEnStorage() {
    // recordatorio: setItem > setter / getItem > getter 
    localStorage.setItem('tickets_gigo', JSON.stringify(this.listaTickets));//JSON.stringify para convertir array (datos) a texto
  }

  
}
