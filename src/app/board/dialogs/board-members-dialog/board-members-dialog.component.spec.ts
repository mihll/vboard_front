import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardMembersDialogComponent } from './board-members-dialog.component';

describe('BoardMembersDialogComponent', () => {
  let component: BoardMembersDialogComponent;
  let fixture: ComponentFixture<BoardMembersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardMembersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardMembersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
