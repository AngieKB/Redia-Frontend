import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  success(message: string): void {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      }
    }).showToast();
  }

  error(message: string): void {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }
    }).showToast();
  }

  warning(message: string): void {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #f093fb, #f5576c)",
      }
    }).showToast();
  }

  info(message: string): void {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #4facfe, #00f2fe)",
      }
    }).showToast();
  }

  // Método temporal para mantener compatibilidad mientras se implementa una solución mejor
  show(message: string): void {
    this.info(message);
  }
}
