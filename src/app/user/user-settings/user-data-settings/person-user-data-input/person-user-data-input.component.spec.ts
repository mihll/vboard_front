import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonUserDataInputComponent } from './person-user-data-input.component';

describe('PersonUserDataInputComponent', () => {
  let component: PersonUserDataInputComponent;
  let fixture: ComponentFixture<PersonUserDataInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonUserDataInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonUserDataInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
