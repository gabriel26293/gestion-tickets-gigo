//DIR18 - MEJORA PARA ver/consultar LOS TICKETS TODO ESTE DOCUMENTO A ESO SE DEDICA
import { Component, OnInit } from '@angular/core';
import { CommonModule, SlicePipe, UpperCasePipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../ticket.service';
import { Ticket } from '../ticket.model';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';//IMPORTO Firestore para buscar directo si recargan F5
import {ChangeDetectorRef } from '@angular/core' //#FIX1 de #DIR18 visualizacion se rompe con f5
import {ChatTicket } from '../chat/chat-ticket/chat-ticket'; //#DIR23 para el chat
import { FormsModule } from '@angular/forms';//#DIR25 MEJORA PARA resolucion y justifcacion de tickets
import { AutenticacionService } from '../autenticacion/autenticacion.service';

@Component({
  selector: 'app-detalle-ticket',
  standalone: true,
  imports: [CommonModule, SlicePipe, UpperCasePipe, DatePipe, ChatTicket, FormsModule], //#DIR23 agrege el chatticket poara el chat //#DIR25 Agregue FormsModule para la mejora de resolucion y justificacion de cierre de ticket
  templateUrl: './detalle-ticket.html'
})
export class DetalleTicket implements OnInit {
  ticketActual: Ticket | undefined;
  cargando: boolean = true;//#DIR18 mejora para cuando le doy a f5 no perder visualizacion al ver el ticket
  mostrandoCajaResolucion: boolean = false; //#DIR25 mejora para la caja de resolucion del ticket (lo usamos mas abajo en iniciarResolucion() y cancelarResolucion() )
  textoResolucion: string = ''; //#DIR25 mejora para la caja de resolucion del ticket. Lo usamos mas abajo en  cancelarResolucion() y confirmarResolucion()

  constructor(
    private rutaActiva: ActivatedRoute,
    private miServicio: TicketService,
    private enrutador: Router,
    private firestore: Firestore, // inyectamos Firestore
    private cdr: ChangeDetectorRef,  //#FIX1 inyecto el detector de cambios. Arreglo de #DIR18
    private servicioAuth: AutenticacionService
  ) {}

  async ngOnInit() {
    try {
      const idParam = this.rutaActiva.snapshot.paramMap.get('id');
      
      if (idParam) {
        this.ticketActual = this.miServicio.obtenerTicketPorId(idParam); // intento buscarlo primero en la memoria del servicio (rapido)

        if (!this.ticketActual) { //Si recargaron la pagina (F5) y la memoria esta vacia, lo vamos a buscar directo a Firebase por ID
          const refDoc = doc(this.firestore, 'tickets', idParam);
          const snapshot = await getDoc(refDoc);
          
          if (snapshot.exists()) {
            const datos = snapshot.data() as Ticket;
            
            let fechaParseada;
            if (datos.fechaCreacion) { // NO entiendo ternario uso if / else
              fechaParseada = (datos.fechaCreacion as any).toDate();
            } else {
              fechaParseada = new Date();
            }
            
            this.ticketActual = {
              ...datos,
              id_ticket: snapshot.id,
              fechaCreacion: fechaParseada
            };

            //#DIR26 MEJORA para apagarle la campanita al ver el mensaje. De aca salto directo a lista-ticket.html para la magia
              const sesion = localStorage.getItem('sesion_usuario');
              /*CODIGO VIEJO #DIR27 if (sesion !== null) {
                const datosSesion = JSON.parse(sesion);
                
                let rolDetectado = '';// Validamos si la propiedad se llama rol o role
                if (datosSesion.rol) {
                  rolDetectado = datosSesion.rol;
                } else {
                  rolDetectado = datosSesion.role;
                }
                this.miServicio.apagarAlerta(this.ticketActual.id_ticket, rolDetectado);
              }*/


          }
        }
      }
    } catch (error) {
      //console.error("Error al intentar rescatar el ticket de la nube:", error);//Me fallaba la carga desde firebase
      console.error("Error consultando Firestore:", error); //atrapo el error para que el codigo no colpse 
    } finally {
      this.cargando = false; //#DIR18 para apagar la carga SIEMPRE (falle o funcione)
      this.cdr.detectChanges(); //#FIX1 DEL #DIR18 Fuerzo a Angular a repintar la pantalla
    }
    // #DIR26 Apagamos la alerta correspondiente al ingresar a la vista
      const idParam = this.rutaActiva.snapshot.paramMap.get('id');
      if (idParam !== null) {
        let esElAdmin = this.esAdmin(); // Usamos tu función segura
        this.miServicio.apagarAlerta(idParam, esElAdmin);
      }

  }

  esAdmin(): boolean {
    return this.servicioAuth.esAdmin();
  }

  /*harcodeo adios!! CODIGO VIEJO
  //#DIR24 MUDANZA de parte del codigo que borra el ticket, antes estaba en lista-tickets.ts, consideramos que era pegriloso
  esAdmin(): boolean {
    const sesion = localStorage.getItem('sesion_usuario');
    if (sesion !== null) {
      const datos = JSON.parse(sesion);
      let validacionAdmin = false;

      if (datos.rol === 'admin') {
        validacionAdmin = true;
      } else if (datos.rol === 'administrador') {
        validacionAdmin = true;
      } else if (datos.rol === 'Administrador') {
        validacionAdmin = true;
      } else if (datos.rol === 'ADMIN') {
        validacionAdmin = true;
      }
      
      if (datos.username === 'admin') {
        validacionAdmin = true;
      } else if (datos.username === 'administrador') {
        validacionAdmin = true;
      } else if (datos.username === 'admin@gigo.com') {
        validacionAdmin = true;
      }

      if (validacionAdmin === true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }*/

  eliminarTicket() {
    if (this.ticketActual) {
      if (this.ticketActual.id_ticket) {
        const confirmacion = window.confirm("¿Esta seguro de eliminar este incidente de forma permanente?");
        
        if (confirmacion === true) {
          this.miServicio.eliminarTicket(this.ticketActual.id_ticket);
          this.enrutador.navigate(['/incidentes']); // Lo devolvemos a la planilla luego de borrar
        } else {
          // El usuario cancelo la alerta, no hacemos nada
        }
      }
    }
  }

  iniciarResolucion() {
    this.mostrandoCajaResolucion = true;
  }

  cancelarResolucion() {
    this.mostrandoCajaResolucion = false;
    this.textoResolucion = '';
  }

  confirmarResolucion() {
    if (this.ticketActual) {
      if (this.ticketActual.id_ticket) {
        if (this.textoResolucion.trim() !== '') {
          const confirmacion = window.confirm("¿Está seguro de cerrar este incidente de forma permanente?");
          if (confirmacion === true) {
            this.miServicio.resolverTicket(this.ticketActual.id_ticket, this.textoResolucion);
            this.enrutador.navigate(['/incidentes']);
          }
        } else {
          alert("Por favor, ingrese una justificación para poder resolver el ticket.");
        }
      }
    }
  }

  volver() {
    this.enrutador.navigate(['/incidentes']);
  }
}