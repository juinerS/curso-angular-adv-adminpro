import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap, map, catchError, delay } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { User } from '../models/user.model';


const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public auth2: any;
  public user: User;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZon: NgZone ) {
    this.googleInit();
  }

  // Obteniendo token del LocalStorge
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  // Obteniendo el id del Usuario
  get uid(): string {
    return this.user.u_id || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  // Login de Google
  googleInit() {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise( resolve => {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '34526840432-m6tdheiqg8gllg5c93k34ietk8bfntjq.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    });
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then( () => {
      this.ngZon.run( () => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  // Validar Token
  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        const { email, google, img, name, role, u_id, } = resp.user;
        this.user = new User(name, email, '', img, google, role, u_id);
        localStorage.setItem('token', resp.newtoken);
        return true;
      }),
      catchError( error => of(false))
    );
  }

  // Crear usuario
  createUser( formData: RegisterForm ) {
    return this.http.post(`${base_url}/user`, formData).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
        // console.log(resp);
      })
    );
  }

  // Actualizar usuario
  updateUser( data: { name: string, email: string, role: string } ) {
    data = {
      ...data,
      role: this.user.role
    };
    return this.http.put(`${base_url}/users/${ this.uid }`, data, this.headers);
  }

  // Loggin
  login( formData: LoginForm ) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
        // console.log(resp);
      })
    );
  }

  // Loggin con GOOGLE
  loginGoogle( token ) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
        // console.log(resp);
      })
    );
  }

  cargarUsers( desde: number = 0 ) {
    const url = `${base_url}/users?desde=${desde}`;
    return this.http.get<{ total: number, users: User[] }>(url, this.headers).pipe( map( resp => {
      // console.log(resp);
      const users = resp.users.map(user => new User(user.name, user.email, '', user.img, user.google, user.role, user.u_id ));
      return {
        total: resp.total,
        users
      };
    })
    );
  }

  eliminarUsuario( usuario: User ){
    // console.log('Eliminando usuario');
    const url = `${base_url}/users/${usuario.u_id}`;
    return this.http.delete(url, this.headers);
  }

  saveUser( user: User ) {
    return this.http.put(`${base_url}/users/${ user.u_id }`, user, this.headers);
  }

}
