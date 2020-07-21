import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {


  // tslint:disable-next-line: no-inferrable-types
  // tslint:disable-next-line: no-input-rename
  @Input('valorEntrante') progreso: number = 50;
  @Input() btnClass: string = 'btn btn-primary';
  // tslint:disable-next-line: no-output-rename
  @Output('valorSaliente') valorsalida: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  get getPorcentaje(){
    return `${ this.progreso }%`;
  }

  cambiarValor( valor:number ){
    if ( this.progreso >= 100 && valor >= 0 ) {
      this.valorsalida.emit(100);
      return this.progreso = 100;
    }

    if ( this.progreso <= 0 && valor < 0 ) {
      this.valorsalida.emit(0);
      return this.progreso = 0;
    }

    this.progreso = this.progreso + valor;
    this.valorsalida.emit(this.progreso);
  }

  onChange( nuevoValor: number ){
    if ( nuevoValor >= 100 ) {
      this.progreso = 100;
    } else if( nuevoValor <= 0 ){
      this.progreso = 0;
    }else {
      this.progreso = nuevoValor;
    }

    this.valorsalida.emit(this.progreso);
  }

}
