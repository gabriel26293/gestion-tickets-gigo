// DIR#6: Separamos la interface del servicio como sugiere el profe, es cierto que queda prolijo
export interface Ticket{
  //id_ticket: number; #DIR9 tengo que cambiar id_ticket a string para migrar a firebase
  id_ticket: string;
  solicitante: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  asignacion: string;
  categoria: string;
  abierto: boolean;
  fechaCreacion: Date;
  imagenUrl?: string //#DIR11 para adjuntar img, lo linkeo a #DIR12 del "formulario.html" <input type="file" (change)="seleccionarImagen($event)">
  justificacionResolucion?: string; // #DIR25 para la resolucion MEJORA
  alertaAdmin?: boolean; // #DIR26 mejora banderas de notificacion de chat
  alertaUser?: boolean; // #DIR26 MEjora banderas de notificacion de chat
}