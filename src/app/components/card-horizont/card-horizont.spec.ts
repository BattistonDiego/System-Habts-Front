import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHorizont } from './card-horizont';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CardHorizont', () => {
  let component: CardHorizont;
  let fixture: ComponentFixture<CardHorizont>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHorizont],
      providers: [provideHttpClient(withFetch()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CardHorizont);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.habito = {
      id: 1,
      nome: 'Beber água',
      cor: '#2196F3',
      meta: 2000,
      unidade: 'ml',
      icone: 'water_drop',
      current: 0,
      concluidoHoje: false,
      valorAtual: 0,
      usuario: {
        id: 1,
        nome: 'Diego',
        email: 'diego@email.com',
        telefone: '11999999999',
        senha: '123456',
        perfil: 'ADMIN',
        status: 'ATIVO',
      },
      // resto dos campos obrigatórios
    };
    fixture.detectChanges(); // agora sim
    expect(component).toBeTruthy();
  });
});
