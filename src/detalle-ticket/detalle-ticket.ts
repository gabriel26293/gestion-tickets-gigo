//DIR18 - MEJORA PARA ver/consultar LOS TICKETS TODO ESTE DOCUMENTO A ESO SE DEDICA
import { Component, OnInit } from '@angular/core';
import { CommonModule, SlicePipe, UpperCasePipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../app/ticket.service';
import { Ticket } from '../app/ticket.model';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';//IMPORTO Firestore para buscar directo si recargan F5
import {ChangeDetectorRef } from '@angular/core' //#FIX1 de #DIR18 visualizacion se rompe con f5

@Component({
  selector: 'app-detalle-ticket',
  standalone: true,
  imports: [CommonModule, SlicePipe, UpperCasePipe, DatePipe],
  templateUrl: './detalle-ticket.html'
})
export class DetalleTicket implements OnInit {
  ticketActual: Ticket | undefined;
  cargando: boolean = true;//#DIR18 mejora para cuando le doy a f5 no perder visualizacion al ver el ticket

  constructor(
    private rutaActiva: ActivatedRoute,
    private miServicio: TicketService,
    private enrutador: Router,
    private firestore: Firestore, // inyectamos Firestore
    private cdr: ChangeDetectorRef  //#FIX1 inyecto el detector de cambios. Arreglo de #DIR18
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
  }

  volver() {
    this.enrutador.navigate(['/incidentes']);
  }
}