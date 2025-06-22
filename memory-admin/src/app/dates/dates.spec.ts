import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dates } from './dates';

describe('Dates', () => {
  let component: Dates;
  let fixture: ComponentFixture<Dates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
