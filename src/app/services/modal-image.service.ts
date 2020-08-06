import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImageService {

  private _ocultarImagen: boolean = true;
  public tipo: 'users'|'medicos'|'hospitals';
  public id: string;
  public img: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal() {
    return this._ocultarImagen;
  }

  abrirModal( tipo: 'users'|'medicos'|'hospitals', id: string, img: string = 'no-image' ){
    this._ocultarImagen = false;
    this.tipo = tipo;
    this.id = id;

    // http://localhost:3000/api/upload/users/5f1a4a04ecbe7a01481ba0e7
    if ( img.includes('https') ) {
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${tipo}/${img}`;
    }

    // this.img = img;
  }
  cerrarModal(){
    this._ocultarImagen = true;
  }

  constructor() { }
}
