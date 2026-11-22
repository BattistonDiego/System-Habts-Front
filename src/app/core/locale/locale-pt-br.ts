import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, Provider } from '@angular/core';

export const LOCALE_APP = 'pt-BR';

/**
 * Registra os dados de locale pt-BR e define o LOCALE_ID da aplicação.
 * Com isso o DatePipe (e o MAT_DATE_LOCALE do Material, que herda o LOCALE_ID)
 * passam a formatar em português: "21 de novembro de 2026".
 */
export function provideLocalePtBr(): Provider[] {
  registerLocaleData(localePt, LOCALE_APP);
  return [{ provide: LOCALE_ID, useValue: LOCALE_APP }];
}
