import { Pipe, PipeTransform } from '@angular/core';
import { AlertState } from '../models/alert';

@Pipe({
  name: 'alertState',
  standalone: true,
})
export class AlertStatePipe implements PipeTransform {
  transform(state: AlertState): string {
    switch (state) {
      case AlertState.N:
        return 'Sin atender';
      case AlertState.A:
        return 'Atendida';
      case AlertState.C:
        return 'Cerrada';
      default:
        return state;
    }
  }
}
