import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Testes } from './testes';

describe('Testes', () => {
  let component: Testes;
  let fixture: ComponentFixture<Testes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Testes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Testes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
