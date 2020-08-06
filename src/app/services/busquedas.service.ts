import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  private transformarUsuarios( resultados: any[] ): User[] {
    return resultados.map(user => new User( user.name, user.email, '', user.img, user.google, user.role, user.u_id ));
  }

  buscar( tipo: 'users'|'medicos'|'hospitals', termino: string ) {
    const url = `${base_url}/todo/conlection/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers).pipe(
      map( (resp: any) => {

        // console.log(resp);
        switch (tipo) {
          case 'users':
            return this.transformarUsuarios(resp.respuesta);
            break;
          default:
            return [];
            break;
        }
      })
    );
  }
}
