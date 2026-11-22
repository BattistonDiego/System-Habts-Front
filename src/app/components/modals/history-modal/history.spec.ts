import { ComponentFixture, TestBed } from '@angular/core/testing';

import { History } from './history';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideLocalePtBr } from '../../../core/locale/locale-pt-br';

describe('History', () => {
  let component: History;
  let fixture: ComponentFixture<History>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [History],
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(History);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('resolve ícones antigos e novos para a ligadura Material', () => {
    expect(component.getHabitIconName({ id: 1, nome: 'A', meta: 1, icon: 'assets/svg/icon-water.svg' })).toBe('water_drop');
    expect(component.getHabitIconName({ id: 2, nome: 'B', meta: 1, icon: 'footprint' })).toBe('directions_walk');
    expect(component.getHabitIconName({ id: 3, nome: 'C', meta: 1, icon: 'sleep' })).toBe('bedtime');
  });

  it('formata a data do histórico em pt-BR', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [History],
      providers: [
        provideLocalePtBr(),
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
    const f = TestBed.createComponent(History);
    f.componentInstance.dataSelecionada.setValue(new Date(2026, 10, 21));
    f.componentInstance.showList = true;
    f.detectChanges();

    expect((f.nativeElement as HTMLElement).textContent).toContain('21 de novembro de 2026');
  });
});
