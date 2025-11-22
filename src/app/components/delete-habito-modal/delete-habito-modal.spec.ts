import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHabitoModal } from './delete-habito-modal';

describe('DeleteHabitoModal', () => {
  let component: DeleteHabitoModal;
  let fixture: ComponentFixture<DeleteHabitoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteHabitoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteHabitoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
