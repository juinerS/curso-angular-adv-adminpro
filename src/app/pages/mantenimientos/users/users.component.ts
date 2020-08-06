import { Component, OnInit, OnDestroy } from '@angular/core';

import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { User } from 'src/app/models/user.model';

import { UserService } from '../../../services/user.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImageService } from '../../../services/modal-image.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})
export class UsersComponent implements OnInit, OnDestroy {

  public totalUsers: number = 0;
  public users: User[] = [];
  public usersTemp: User[] = [];

  public imgSubs: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor( private userService: UserService,
               private busquedasService: BusquedasService,
               private modalImageService: ModalImageService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUser();
    this.modalImageService.nuevaImagen.pipe( delay(100) ).subscribe( img => this.cargarUser() );
  }

  cargarUser() {
    this.cargando = true;
    this.userService.cargarUsers(this.desde).subscribe( ({ total, users }) => {
      this.totalUsers = total;
      this.users = users;
      this.usersTemp = users;
      this.cargando = false;
    });
  }

  cambiarPagna( valor: number ) {
    this.desde += valor;

    if ( this.desde <= 0 ) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsers ) {
      this.desde -= valor;
    }

    this.cargarUser();
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.users = this.usersTemp;
    }
    this.busquedasService.buscar('users', termino).subscribe(resp => {
      this.users = resp;
    });
  }

  eliminarUsuaro( usuario: User ) {

    if (usuario.u_id === this.userService.uid) {
      return Swal.fire({
        title: 'Error',
        text: 'No te puedes borrar',
        icon: 'error'
      });
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estas seguro que deseas eliminar a ${ usuario.name }`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.value) {
        this.userService.eliminarUsuario(usuario).subscribe(
          resp => {
            Swal.fire(
              'Eliminado!',
              `El usuario ${usuario.name} ha sido eliminado`,
              'success'
            );

            this.cargarUser();
          }
        );
      }
    });
  }

  cambiarRole( usuario: User ) {
    // console.log(usuario);

    this.userService.saveUser(usuario).subscribe( resp => {
      console.log(resp);
    });
  }


  abrirModal( user: User ){
    // console.log(user);
    this.modalImageService.abrirModal('users', user.u_id, user.img );
  }

}
