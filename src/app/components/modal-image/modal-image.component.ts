import { Component, OnInit } from '@angular/core';
import { ModalImageService } from '../../services/modal-image.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: [
  ]
})
export class ModalImageComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp: any = null;

  constructor( public modalImageService: ModalImageService, private fileUploadService: FileUploadService ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImageService.cerrarModal();
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

    const id = this.modalImageService.id;
    const tipo = this.modalImageService.tipo;

    this.fileUploadService.actualizarFoto( this.imagenSubir, tipo, id )
      .then( img => {

        if ( this.fileUploadService.imgNoPertida === false ) {
          Swal.fire('Error', 'El tipo de imagen no es permitido', 'error');
          this.cerrarModal();
          return false;
        }
        Swal.fire('Actualizada', 'Foto de perfil actualizada', 'success');

        this.modalImageService.nuevaImagen.emit(img);
        
        this.cerrarModal();
      // this.user.img = img;
    }).catch( err => {
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    });
  }

}
