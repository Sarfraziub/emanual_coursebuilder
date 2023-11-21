import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepZeroComponent } from './step-zero.component';

describe('StepZeroComponent', () => {
  let component: StepZeroComponent;
  let fixture: ComponentFixture<StepZeroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepZeroComponent],
    });
    fixture = TestBed.createComponent(StepZeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
