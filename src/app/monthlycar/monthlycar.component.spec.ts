import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlycarComponent } from './monthlycar.component';

describe('MonthlycarComponent', () => {
  let component: MonthlycarComponent;
  let fixture: ComponentFixture<MonthlycarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlycarComponent]
    });
    fixture = TestBed.createComponent(MonthlycarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
