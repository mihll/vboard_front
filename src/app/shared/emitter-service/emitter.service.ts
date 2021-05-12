import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmitterService {

  public shouldReloadMyBoardsEmitter: EventEmitter<boolean> = new EventEmitter();
  public shouldReloadCurrentBoardEmitter: EventEmitter<boolean> = new EventEmitter();
  public searchPostsEmitter: EventEmitter<string> = new EventEmitter();

  constructor() { }

  emitReloadMyBoardsEvent(): void {
    this.shouldReloadMyBoardsEmitter.emit(true);
  }

  emitReloadCurrentBoardEvent(): void {
    this.shouldReloadCurrentBoardEmitter.emit(true);
  }

  emitSearchPostsEvent(searchText: string): void {
    this.searchPostsEmitter.emit(searchText);
  }
}
