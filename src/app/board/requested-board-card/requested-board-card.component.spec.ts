import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedBoardCardComponent } from './requested-board-card.component';

describe('RequestedBoardCardComponent', () => {
  let component: RequestedBoardCardComponent;
  let fixture: ComponentFixture<RequestedBoardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedBoardCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedBoardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
