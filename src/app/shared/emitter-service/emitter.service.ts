import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmitterService {

  public shouldReloadBoardsEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  emitReloadEvent(): void {
    this.shouldReloadBoardsEmitter.emit(true);
  }
}
