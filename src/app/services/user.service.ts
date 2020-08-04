import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor( private http: HttpClient, private router: Router, private ngZon: NgZone ) { this.googleInit(); }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get uid(): string {
    return this.user.u_id || '';
  }

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

  createUser( formData: RegisterForm ) {
    return this.http.post(`${base_url}/user`, formData).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
        // console.log(resp);
      })
    );
  }

  updateUser( data: { name: string, email: string, role: string } ) {
    data = {
      ...data,
      role: this.user.role
    }
    return this.http.put(`${base_url}/user/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
  });
  }


  login( formData: LoginForm ) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
        // console.log(resp);
      })
    );
  }

  loginGoogle( token ) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
        // console.log(resp);
      })
    );
  }
}
