//#DIR22 ARmo un ts para el tablero solo para eso
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../ticket.service';
import Chart from 'chart.js/auto'; // importamos la libreria grafica, la magia papa!

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  
  totalTickets: number = 0;// variables para las trjetas (KPI)
  abiertos: number = 0;
  resueltos: number = 0;

  constructor(private miServicio: TicketService) {}

  ngOnInit() {
    
    const tickets = this.miServicio.listaTickets();// calculo los numeros basicos leyendo el Signal del servicio
    this.totalTickets = tickets.length;
    
    
    tickets.forEach(ticket => {// cuento usando if / else estructurado
      if (ticket.abierto) {
        this.abiertos++;
      } else {
        this.resueltos++;
      }
    });
  }

  
  ngAfterViewInit() {// AfterViewInit asegura que el HTML ya este dibujado antes de intentar pintar o hacer el grafico supongo, en teoria
    this.generarGraficoEstados();
  }

  generarGraficoEstados() {
    const lienzo = document.getElementById('graficoEstados') as HTMLCanvasElement;
    
    if (lienzo) {
      new Chart(lienzo, {
        type: 'pie', // grafico de torta, me parece buena opcion, luego ver si hay otros
        data: {
          labels: ['Abiertos', 'Resueltos'],
          datasets: [{
            data: [this.abiertos, this.resueltos],
            backgroundColor: ['#e74c3c', '#2ecc71'] // colores  por ahora
          }]
        }
      });
    }
  }
}