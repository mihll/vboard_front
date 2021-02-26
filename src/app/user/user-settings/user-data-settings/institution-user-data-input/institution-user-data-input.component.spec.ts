import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionUserDataInputComponent } from './institution-user-data-input.component';

describe('InstitutionUserDataInputComponent', () => {
  let component: InstitutionUserDataInputComponent;
  let fixture: ComponentFixture<InstitutionUserDataInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionUserDataInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionUserDataInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
