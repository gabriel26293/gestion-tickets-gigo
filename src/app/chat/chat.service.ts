//#DIR23 arrancamos con el chat
import { Injectable, signal } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, orderBy } from '@angular/fire/firestore';
import { Mensaje } from './chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  listaMensajes = signal<Mensaje[]>([]);// uso signal para que el HTML se entere al toque de los mensajes nuevos

  constructor(private firestore: Firestore) {}
  
  async cargarMensajes(idTicket: string) {// Leer mensajes de la subcoleccion del ticket especifico
    const rutaSubcoleccion = `tickets/${idTicket}/comentarios`;
    const coleccion = collection(this.firestore, rutaSubcoleccion);
        
    const consulta = query(coleccion, orderBy('fecha', 'asc'));// ordeno por fecha ascendente (los mas viejos arriba, los nuevos abajo)
    const respuesta = await getDocs(consulta);
    
    const mensajesTemporales: Mensaje[] = [];
    
    respuesta.forEach((documento) => {
      const datos = documento.data();
      
      let fechaParseada = new Date();
      if (datos['fecha']) {
         fechaParseada = datos['fecha'].toDate();
      }
      
      const mensajeExtraido: Mensaje = {
        id_mensaje: documento.id,
        autor: datos['autor'],
        texto: datos['texto'],
        fecha: fechaParseada
      };
      
      mensajesTemporales.push(mensajeExtraido);
    });
    
    this.listaMensajes.set(mensajesTemporales);
  }
  
  async enviarMensaje(idTicket: string, autorIngresado: string, textoIngresado: string) {// escribo un nuevo mensaje
    const rutaSubcoleccion = `tickets/${idTicket}/comentarios`;
    const coleccion = collection(this.firestore, rutaSubcoleccion);
    
    const nuevoMensaje = {
      autor: autorIngresado,
      texto: textoIngresado,
      fecha: new Date()
    };
    
    await addDoc(coleccion, nuevoMensaje);
        
    this.cargarMensajes(idTicket);// refresco la lista local para ver el mensaje que acabu de enviar
  }
}