import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportClient } from './support-client';

describe('SupportClient', () => {
  let component: SupportClient;
  let fixture: ComponentFixture<SupportClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportClient],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
