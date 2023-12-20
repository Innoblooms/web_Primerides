import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondationsComponent } from './condations.component';

describe('CondationsComponent', () => {
  let component: CondationsComponent;
  let fixture: ComponentFixture<CondationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CondationsComponent]
    });
    fixture = TestBed.createComponent(CondationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
