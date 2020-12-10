import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTestcaseComponent } from './single-testcase.component';

describe('SingleTestcaseComponent', () => {
  let component: SingleTestcaseComponent;
  let fixture: ComponentFixture<SingleTestcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTestcaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTestcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
