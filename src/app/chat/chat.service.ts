//#DIR23 arrancamos con el chat
import { Injectable, signal } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, orderBy } from '@angular/fire/firestore'; //getDoc puede que ya no lo necesite prque vamos a usar onSnapshot abajo
import {onSnapshot} from '@angular/fire/firestore'; //#DIR27 MEJORA para refrescar sola la ifnromacion de firebase
import { Mensaje } from './chat.model';
import { doc, updateDoc } from '@angular/fire/firestore';//#DIR26 Mejora para ver mensajes pendientes en el chat, le pegamos a firestone
import { AutenticacionService } from '../autenticacion/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  listaMensajes = signal<Mensaje[]>([]);// uso signal para que el HTML se entere al toque de los mensajes nuevos

  constructor(private firestore: Firestore, private servicioAuth: AutenticacionService) {}
  
  /*async*/ cargarMensajes(idTicket: string) {// leer mensajes de la subcoleccion del ticket especifico //#DIR27 le saco el async porque onSnapshot es un listener pasivo
      const rutaSubcoleccion = `tickets/${idTicket}/comentarios`;
      const coleccion = collection(this.firestore, rutaSubcoleccion);
          
      const consulta = query(coleccion, orderBy('fecha', 'asc'));// ordeno por fecha ascendente (los mas viejos arriba, los nuevos abajo)
      //const respuesta = await getDocs(consulta); //#DIR27 MEJORA para refrescar los mensajes del chat automaticamente la mejora es la sigueinte linea
      onSnapshot(consulta, (respuesta) => {//#DIR27    ESTA ES LA MEJORA de aca salto a la refactorizacion del ticket-services.ts
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
    });
  }
  
  //#DIR26 este nuevo metodo se engancha con el ticket.services.ts
  async enviarMensaje(idTicket: string, autorIngresado: string, textoIngresado: string) { //#DIR26 Mejora para manejar los chat y los que van surgiendo nuevos
      const rutaSubcoleccion = `tickets/${idTicket}/comentarios`;
      const coleccion = collection(this.firestore, rutaSubcoleccion);
      
      const nuevoMensaje = {
        autor: autorIngresado,
        texto: textoIngresado,
        fecha: new Date()
      };
      
      await addDoc(coleccion, nuevoMensaje);          
      
      const referenciaTicket = doc(this.firestore, 'tickets', idTicket);// #DIR26 LOgica de notificaciones cruzadas
      let validacionAdmin = false;

      // nuevo codigo lo cambiamos para mejorar
      if (this.servicioAuth.esAdmin()) {
        
        await updateDoc(referenciaTicket, { alertaUser: true });// escribio el admin le encendemos la alerta al usuario
      } else {        
        await updateDoc(referenciaTicket, { alertaAdmin: true });// escribio el usuario le encendemos la alerta al admin
      }
      /*CODIGO VIEJO HARCODEO
      if (autorIngresado === 'admin') {
        validacionAdmin = true;
      } else if (autorIngresado === 'administrador') {
        validacionAdmin = true;
      } else if (autorIngresado === 'admin@gigo.com') {
        validacionAdmin = true;
      }

      /*
      if (validacionAdmin === true) {
        // Escribio el admin, le encendemos la alerta al usuario
        await updateDoc(referenciaTicket, { alertaUser: true });//#DIR26 MEJORA usamos los boleanos para el user y esto me avisa si tengo mensaje nuevo
      } else {
        // Escribio el usuario, le encendemos la alerta al admin
        await updateDoc(referenciaTicket, { alertaAdmin: true });//#DIR26 MEJORA usamos los boleanos para el admin y esto me avisa si tengo mensaje nuevo
      }*/
          
      //#DIR27 ELIMINAMOS esta linea habiendo aplicado la mejora del refresh this.cargarMensajes(idTicket);// refresco la lista local para ver el mensaje que acabu de enviar
    }
}