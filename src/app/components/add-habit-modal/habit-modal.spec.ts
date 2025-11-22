import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitModal } from './habit-modal';

describe('HabitModal', () => {
  let component: HabitModal;
  let fixture: ComponentFixture<HabitModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitModal],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
