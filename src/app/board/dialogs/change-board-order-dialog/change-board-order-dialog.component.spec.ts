import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeBoardOrderDialogComponent } from './change-board-order-dialog.component';

describe('ChangeBoardOrderDialogComponent', () => {
  let component: ChangeBoardOrderDialogComponent;
  let fixture: ComponentFixture<ChangeBoardOrderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeBoardOrderDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBoardOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
