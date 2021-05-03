import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardJoinRequestsDialogComponent } from './board-join-requests-dialog.component';

describe('BoardJoinRequestsDialogComponent', () => {
  let component: BoardJoinRequestsDialogComponent;
  let fixture: ComponentFixture<BoardJoinRequestsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardJoinRequestsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardJoinRequestsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
