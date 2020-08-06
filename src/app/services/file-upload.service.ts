import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  public imgNoPertida: boolean = false;

  constructor() { }

  async actualizarFoto( archivo: File, tipo: 'users'|'medicos'|'hospitals', id: string ) {
    try {

      const url = `${ base_url }/upload/${ tipo }/${ id }`;
      const formData = new FormData();
      formData.append('image', archivo);

      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token')
        },
        body: formData
      });

      const data = await resp.json();
      if ( data.ok ) {
        this.imgNoPertida = true;
        return data.nombreArchivo;
      } else {
        console.log(data.msg);
        return this.imgNoPertida;
      }

      // console.log(data);

      // return 'nombe de la imagen';

    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
