import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { User } from '../../models/user.model';

import { UserService } from '../../services/user.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public profileFrom: FormGroup;
  public user: User;
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor( private fb: FormBuilder, private userService: UserService, private fileUploadService: FileUploadService ) {
    this.user = userService.user;
  }

  ngOnInit(): void {

    this.profileFrom = this.fb.group({
      name: [ this.user.name, Validators.required ],
      email: [ this.user.email, [ Validators.required, Validators.email ]]
    });
  }

  actualizarPerfil() {
    // console.log(this.profileFrom.value);
    this.userService.updateUser( this.profileFrom.value ).subscribe( resp => {
      // console.log(resp);
      const { name, email } = this.profileFrom.value;
      this.user.name = name;
      this.user.email = email;

      Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
    }, (err) => {
      Swal.fire('Error', err.error.msg, 'error');
      // console.log(err.error.msg);
    });
  }

  cambiarImagen( file: File ){
    this.imagenSubir = file;

    if ( !file ) { return this.imgTemp = null; }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      // console.log(reader.result);
    };
  }

  subirImagen() {
    this.fileUploadService.actualizarFoto( this.imagenSubir, 'users', this.user.u_id ).then( img => {
      this.user.img = img;
      Swal.fire('Actualizada', 'Foto de perfil actualizada', 'success');
    });
  }

}
