import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { resolve } from 'dns';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public auth2: any;

  constructor( private http: HttpClient, private router: Router, private ngZon: NgZone ) { this.googleInit(); }

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

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then( () => {
      this.ngZon.run( () => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        // localStorage.setItem('token', resp.token);
        const tokenPrueba = token;
        localStorage.setItem('token', tokenPrueba);
      }),
      map( resp => true),
      catchError( error => of(false))
    );
  }

  createUser( formData: RegisterForm ) {
    return this.http.post(`${base_url}/user`, formData).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
        console.log(resp);
      })
    );
  }


  login( formData: LoginForm ) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
        console.log(resp);
      })
    );
  }

  loginGoogle( token ) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
        console.log(resp);
      })
    );
  }
}
