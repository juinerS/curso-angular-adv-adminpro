import { environment } from '../../environments/environment';

const base_url = environment.base_url;

export class User {
    constructor(
        public name: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: string,
        public u_id?: string ){
    }
    get imagenUrl(){
        // /upload/users/dflsñ

        if ( this.img === undefined ) {
            return `${base_url}/upload/users/no-image`;
        }

        if ( this.img.includes('https') ) {
            return this.img;
        }

        if ( this.img ) {
            return `${base_url}/upload/users/${this.img}`;
        } else {
            return this.img =`${base_url}/upload/users/no-image`;
        }
    }
}
