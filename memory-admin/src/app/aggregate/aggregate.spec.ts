import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aggregate } from './aggregate';

describe('Aggregate', () => {
  let component: Aggregate;
  let fixture: ComponentFixture<Aggregate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aggregate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aggregate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
