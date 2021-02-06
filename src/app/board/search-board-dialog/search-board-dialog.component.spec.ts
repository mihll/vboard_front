import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardSearchDialogComponent } from './search-board-dialog.component';

describe('BoardSearchDialogComponent', () => {
  let component: BoardSearchDialogComponent;
  let fixture: ComponentFixture<BoardSearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardSearchDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
