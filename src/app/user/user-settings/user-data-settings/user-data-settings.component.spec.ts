import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataSettingsComponent } from './user-data-settings.component';

describe('UserDataSettingsComponent', () => {
  let component: UserDataSettingsComponent;
  let fixture: ComponentFixture<UserDataSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDataSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDataSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
