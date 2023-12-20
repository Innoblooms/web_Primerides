import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundpolicyComponent } from './refundpolicy.component';

describe('RefundpolicyComponent', () => {
  let component: RefundpolicyComponent;
  let fixture: ComponentFixture<RefundpolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RefundpolicyComponent]
    });
    fixture = TestBed.createComponent(RefundpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
