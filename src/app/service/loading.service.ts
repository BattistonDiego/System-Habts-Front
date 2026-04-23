import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private contador = 0;
  isLoading = signal(false);

  show() {
    this.contador++;
    this.isLoading.set(true);
  }
  hide() {
    this.contador--;

    if (this.contador <= 0) {
      this.isLoading.set(false);
    }
  }
}
