import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://192.168.0.7:8000/api/invitados/crearInvitado/'; // URL a tu API Django

  constructor(private http: HttpClient) {}

  // Método para crear un invitado y recibir el QR en respuesta
  crearInvitado(nombre: string, email: string, id_celebracion: number): Observable<Blob> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('email', email)
      .set('celebracion_id', id_celebracion.toString());

    // Realiza una petición GET y espera la respuesta como un 'blob' (imagen QR)
    return this.http.get(this.apiUrl, { params, responseType: 'blob' });
  }
}


