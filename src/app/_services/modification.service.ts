import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModificationService {
  private modifiedFlag = false;

  setModifiedFlag(value: boolean): void {
    this.modifiedFlag = value;
  }

  getModifiedFlag(): boolean {
    return this.modifiedFlag;
  }
}
