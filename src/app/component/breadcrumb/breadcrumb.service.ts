import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BreadcrumbDynamicLabel } from './breadcrumb.api';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private dynamicCodeNotification: Subject<BreadcrumbDynamicLabel>;
  private previousLabelMap = new Map<string, string>();

  constructor() {
    this.dynamicCodeNotification = new Subject<BreadcrumbDynamicLabel>();
  }

  dynamicCodeNotifications(): Observable<BreadcrumbDynamicLabel> {
    return this.dynamicCodeNotification.asObservable();
  }

  updateDynamicLabel(dynamicCode: string, label: string): void {
    this.previousLabelMap.set(dynamicCode, label);
    this.dynamicCodeNotification.next({ dynamicCode, label});
  }

  purgeDynamicLabels(): void {
    this.previousLabelMap.clear();
  }

  resetDynbamicLabel(dynamicCode: string): void {
    this.previousLabelMap.delete(dynamicCode);
    this.dynamicCodeNotification.next({ dynamicCode, label : ''});
  }

  getDynamicLabel(dynamicCode: string): string | undefined {
    return this.previousLabelMap.get(dynamicCode);
  }
}
