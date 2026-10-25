//#DIR23 aca a futuro armamos el chat
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // lo necesito para el [(ngModel)]
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-ticket.html'
})
export class ChatTicket implements OnInit {
  
  @Input() idTicket: string = '';// @Input() permite recibir el ID del ticket desde afuera
  
  nuevoMensaje: string = '';
  usuarioActual: string = 'Anonimo';

  
  constructor(public servicioChat: ChatService) {}// inyecto nuestro nuevo servicio de chat

  ngOnInit() {
    
    const sesion = localStorage.getItem('sesion_usuario');// rescatamos quien es el usuario que esta chateando
    if (sesion !== null) {
      this.usuarioActual = JSON.parse(sesion).username;
    }

    
    if (this.idTicket !== '') {//Si recibimos un id valido, le pido al servicio que traiga los mensajes
      this.servicioChat.cargarMensajes(this.idTicket);
    }
  }

  enviar() {
    
    if (this.nuevoMensaje.trim() !== '') {// valido que no envien mensajes vacios o llenos de espacios
      this.servicioChat.enviarMensaje(this.idTicket, this.usuarioActual, this.nuevoMensaje);
      this.nuevoMensaje = ''; // Limpiamos la caja de texto
    } else {
      // Si está vacio, porahora no hacemos nada (Evitamos enviar basura a Firebase porque me morfa recurso)
    }
  }
}