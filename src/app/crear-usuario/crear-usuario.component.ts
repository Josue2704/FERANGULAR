import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {
  // Objeto que representa los datos del usuario
  usuario = {
    nombre: '',
    email: '',
    celebracion_id: 1 // Alineado con la API de Django
  };

  constructor(private http: HttpClient) {}

  // Método que envía los datos del usuario al backend Node.js
  crearUsuario() {
    const { nombre, email, celebracion_id } = this.usuario;

    if (!nombre || !email || !celebracion_id) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Enviar los datos al backend Node.js en localhost:3000
    this.http.post('http://localhost:3000/api/registrar-usuario', this.usuario)
      .subscribe({
        next: (response) => {
          console.log('Usuario registrado:', response);
          alert('Usuario registrado y correo enviado correctamente.');
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
          alert('Hubo un error al registrar el usuario.');
        }
      });
  }
}
