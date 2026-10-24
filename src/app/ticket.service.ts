import { Injectable } from '@angular/core';
import { Ticket } from './ticket.model'; //el molde que migre
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';// Importamos  herramientas dde Firestore
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage'; //#DIR13 herramientas de AngularFire para Storage (subir a la nube)
import { signal } from '@angular/core'; // #DIR14 solucion al refresh del html, cada vez que me logeo no veo los tickets, el signal nos va a ayudar

/*#DIR6Mudado a ticket.model.ts a pedido del profe
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
}*/

@Injectable({
  providedIn: 'root',
})
export class TicketService {


  //listaTickets: Ticket[] = [];  #DIR14 nos conviene borrar esto para sumar el signal y darle solucion al refresh luego de hacer login para ver los tickets
   
  listaTickets = signal<Ticket[]>([]); //#DIR14 AHORA ES UN SIGNAL REACTIVO
  //contadorId: number; //#DIR9 ahora paso a armarlo con firestone
  
  constructor(private firestore: Firestore, private storage: Storage) {// #DIR9 inyecto la bd de Firebase   #DIR13 agrego Srtorage para subir a la nube la img 
    this.obtenerTicketsDeFirestore();// Al arrancar, buscamos los tickets reales en la nube
  }

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

/*#DIR9 CODIGO VIEJO - Cuando guardaba en storage, lo mude para usar firestone
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
*/
  // DIR#9A (referencia al doc): LEER (GET) - Traer tickets de la nube
  async obtenerTicketsDeFirestore() {
    const coleccion = collection(this.firestore, 'tickets'); // Apunta a la carpeta "tickets"
    const respuesta = await getDocs(coleccion);
    
    //this.listaTickets = []; // vacio la memoria temporal (esta mal). #DIR9 ERROR- Lo mude porque sino mostraba 0 tickets, lo mejore en la siguiente linea
    const ticketsTemporales: Ticket[] =[];//#DIR9 mejora de this.listaTickets = []; . Mostraba 0 tickest

    respuesta.forEach((documento) => {
      const ticketTemporal = documento.data() as Ticket;
      ticketTemporal.id_ticket = documento.id; // Le metemos el ID raro que genera Firebase
      
      if (documento.data()['fechaCreacion']) {// Convertimos la fecha de firebase a una fecha normal de javascript
         ticketTemporal.fechaCreacion = documento.data()['fechaCreacion'].toDate();
      }
      ticketsTemporales.push(ticketTemporal);//Lleno en array temporal
    });
    //this.listaTickets = ticketsTemporales;//#DIR9 lo asigno directo y el pipe conecta el cambio al toque y dibuja tabla.  #DIR14 nos dio dolor de cabeza tuve que optar por signal, siguiente linea de codigo
    this.listaTickets.set(ticketsTemporales); //#DIR14 mejora con signal para refrescar lista de tickets
  }

  // DIR#9B (referencia al doc): CREAR (POST) - #DIR13:  
  /*CODIGO VIEJO REEMPLAZADO POR #DIR13 SUBIR IMAGEN 
  async agregarTicket(solicitanteIngresado: string, tituloIngresado: string, descripcionIngresada: string, tipoIngresado: string, asignacionIngresada: string, categoriaIngresada: string) {
    const nuevoIncidente = {
      solicitante: solicitanteIngresado,
      titulo: tituloIngresado,
      descripcion: descripcionIngresada,
      tipo: tipoIngresado,
      asignacion: asignacionIngresada,
      categoria: categoriaIngresada,
      abierto: true,
      fechaCreacion: new Date() // Firebase lo convierte automatico
    };
    
    const coleccion = collection(this.firestore, 'tickets');
    await addDoc(coleccion, nuevoIncidente); // Lo sube a la bd
    
    this.obtenerTicketsDeFirestore(); // Refrescamos la grilla pidiendo los datos actualizados
  }*/
  async agregarTicket(solicitanteIngresado: string, tituloIngresado: string, descripcionIngresada: string, tipoIngresado: string, asignacionIngresada: string, categoriaIngresada: string, archivo: File | null) { //#DIR13 agregue archivo: FILE | null para manejar img
      
      let urlDeImagen = '';
      
      if (archivo !== null) {// Si el usuario adjuntO una foto...
        
        const rutaAlmacenamiento = ref(this.storage, `tickets/${archivo.name}`);// Apunto a la carpeta 'tickets' en Storage
        
        await uploadBytes(rutaAlmacenamiento, archivo);// subo el archivo
        
        urlDeImagen = await getDownloadURL(rutaAlmacenamiento);// }Pido la url publica
      }

      const nuevoIncidente = {
        solicitante: solicitanteIngresado,
        titulo: tituloIngresado,
        descripcion: descripcionIngresada,
        tipo: tipoIngresado,
        asignacion: asignacionIngresada,
        categoria: categoriaIngresada,
        abierto: true,
        fechaCreacion: new Date(),// Firebase lo convierte automatico
        imagenUrl: urlDeImagen // GuardO la URL en el ticket
      };
      
      const coleccion = collection(this.firestore, 'tickets');
      await addDoc(coleccion, nuevoIncidente); // Lo sube a la bd
      
      this.obtenerTicketsDeFirestore(); // Refrescamos la grilla pidiendo los datos actualizados
    }
  
  obtenerTicketPorId(idBuscado: string) {// Buscar uno solo localmente (Para autocompletar el formulario al editar)
    //return this.listaTickets.find(ticket => ticket.id_ticket === idBuscado); #DIR14 reemplace esta linea con la siguiente de abajo
    return this.listaTickets().find(ticket => ticket.id_ticket === idBuscado) //#DIR mejora con signal para refrescar tickets en pantalla
  }

  // DIR#9C (ref doc): ACTUALIZAR (PUT)
  async actualizarTicket(idBuscado: string, tituloNuevo: string, descripcionNueva: string, tipoNuevo: string, asignacionNueva: string, categoriaNueva: string) {
    const referencia = doc(this.firestore, 'tickets', idBuscado); // Buscamos el documento exacto
    await updateDoc(referencia, {
      titulo: tituloNuevo,
      descripcion: descripcionNueva,
      tipo: tipoNuevo,
      asignacion: asignacionNueva,
      categoria: categoriaNueva
    });
    this.obtenerTicketsDeFirestore();
  }

  async resolverTicket(idBuscado: string) {
    const referencia = doc(this.firestore, 'tickets', idBuscado);
    await updateDoc(referencia, { abierto: false });
    this.obtenerTicketsDeFirestore();
  }

  // DIR#9D (ref doc): BORRAR (DELETE) 
  async eliminarTicket(idBuscado: string) {
    const referencia = doc(this.firestore, 'tickets', idBuscado);
    await deleteDoc(referencia);
    this.obtenerTicketsDeFirestore();
  }
}
