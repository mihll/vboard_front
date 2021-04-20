import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardInfoDialogComponent } from './board-info-dialog.component';

describe('BoardInfoDialogComponent', () => {
  let component: BoardInfoDialogComponent;
  let fixture: ComponentFixture<BoardInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
