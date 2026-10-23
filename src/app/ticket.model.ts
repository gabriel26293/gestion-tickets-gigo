// DIR#6: Separamos la interface del servicio como sugiere el profe, es cierto que queda prolijo
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