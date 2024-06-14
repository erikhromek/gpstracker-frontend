import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  Injector,
  createComponent,
} from '@angular/core';
import { AlertAttendComponent } from '../components/alert-attend/alert-attend.component';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  private elements: HTMLElement[] = [];
  private refs: ComponentRef<unknown>[] = [];

  constructor(
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) {}

  createPopUpElement(alert: Alert): HTMLElement {
    const element = document.createElement('div');
    const component = createComponent(AlertAttendComponent, {
      elementInjector: this.injector,
      environmentInjector: this.environmentInjector,
      hostElement: element,
    });
    this.applicationRef.attachView(component.hostView);
    component.instance.alert = alert;
    return element;
  }

  clearElements(): void {
    this.refs.splice(0).forEach((ref) => ref.destroy());
    this.elements.splice(0).forEach((element) => element.remove());
  }
}
