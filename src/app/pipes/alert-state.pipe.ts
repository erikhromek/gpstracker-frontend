import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alertState',
  standalone: true,
})
export class AlertStatePipe implements PipeTransform {
  transform(state: string | null | undefined): string | null | undefined {
    switch (state) {
      case 'N':
        return 'Sin atender';
      case 'A':
        return 'Atendida';
      case 'C':
        return 'Cerrada';
      default:
        return state;
    }
  }
}
