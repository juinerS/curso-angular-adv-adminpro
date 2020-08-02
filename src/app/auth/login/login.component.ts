import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { UserService } from '../../services/user.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ],
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: [ '', Validators.required ],
    remember: [false]
  });

  constructor( private router: Router, private fb: FormBuilder, private userService: UserService, private ngZone: NgZone ) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login() {
    this.userService.login(this.loginForm.value).subscribe( resp => {
      if ( this.loginForm.get('remember').value ) {
        localStorage.setItem('email', this.loginForm.get('email').value);
      } else {
        localStorage.removeItem('email');
      }
      // console.log(resp);

      // Navegar al DashBoart
      this.router.navigateByUrl('/');
    }, (err) => {
      Swal.fire('Error', err.error.msg, 'error');
    });
    // console.log(this.loginForm.value);
    // this.router.navigateByUrl('/');
  }

  // const id_token = googleUser.getAuthResponse().id_token;
  // console.log('Logged in as: ' + googleUser.getBasicProfile().getName());

  renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
    });

    this.startApp();
  }

  async startApp() {
    // gapi.load('auth2', () => {
    //   // Retrieve the singleton for the GoogleAuth library and set up the client.
    //   this.auth2 = gapi.auth2.init({
    //     client_id: '34526840432-m6tdheiqg8gllg5c93k34ietk8bfntjq.apps.googleusercontent.com',
    //     cookiepolicy: 'single_host_origin',
    //     // Request scopes in addition to 'profile' and 'email'
    //     // scope: 'additional_scope'
    //   });
    // });
      await this.userService.googleInit();

      this.auth2 = this.userService.auth2;
      this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element) {
    // console.log(element.id);
    this.auth2.attachClickHandler(element, {},
    (googleUser) => {
      // document.getElementById('name').innerText = 'Signed in: ' + googleUser.getBasicProfile().getName();
      const id_token = googleUser.getAuthResponse().id_token;
      this.userService.loginGoogle(id_token).subscribe( resp => {
        this.ngZone.run( () => {
          // Navegar al DashBoart
          this.router.navigateByUrl('/');
        });
      });

    }, (error) => {
      alert(JSON.stringify(error, undefined, 2));
    });
  }



}
