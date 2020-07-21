import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  labels1: string[] = ['Gaseosa', 'Pastel', 'Pollo azado'];
  data1 = [
    [20, 15, 100],
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
