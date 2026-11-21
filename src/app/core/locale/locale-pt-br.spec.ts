import { DatePipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { LOCALE_APP, provideLocalePtBr } from './locale-pt-br';
import { appConfig } from '../../app.config';

describe('provideLocalePtBr', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideLocalePtBr(), DatePipe] });
  });

  it('define LOCALE_ID como pt-BR', () => {
    expect(TestBed.inject(LOCALE_ID)).toBe('pt-BR');
    expect(LOCALE_APP).toBe('pt-BR');
  });

  it('o DatePipe formata o mês em português', () => {
    const pipe = TestBed.inject(DatePipe);
    expect(pipe.transform(new Date(2026, 10, 21), "dd 'de' MMMM 'de' yyyy")).toBe(
      '21 de novembro de 2026',
    );
    expect(pipe.transform(new Date(2026, 10, 21), 'dd/MM/yyyy')).toBe('21/11/2026');
  });

  it('o MAT_DATE_LOCALE do Material herda o pt-BR', () => {
    expect(TestBed.inject(MAT_DATE_LOCALE)).toBe('pt-BR');
  });

  it('está registrado no appConfig', () => {
    const temLocale = appConfig.providers.some(
      (p) => Array.isArray(p) && p.some((x: any) => x?.provide === LOCALE_ID && x.useValue === 'pt-BR'),
    );
    expect(temLocale).toBeTrue();
  });
});
