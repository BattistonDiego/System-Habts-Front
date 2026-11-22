import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabtsPage } from './habts-page';
import { Habito } from '../../interface/habito.model';
import { HabitoService } from '../../service/habito.service';
import { of } from 'rxjs';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';
import { HistoricoService } from '../../service/historico.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideLocalePtBr } from '../../core/locale/locale-pt-br';

describe('HabtsPage', () => {
  let component: HabtsPage;
  let fixture: ComponentFixture<HabtsPage>;

  let habitService: jasmine.SpyObj<HabitoService>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let historicoService: jasmine.SpyObj<HistoricoService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    habitService = jasmine.createSpyObj('HabitoService', ['getHabitos', 'editHabitos']);
    usuarioService = jasmine.createSpyObj('UsuarioService', ['getUserLogged']);
    historicoService = jasmine.createSpyObj('HistoricoService', [
      'getListHistoricoByDate',
      'postHistorico',
      'getStreak',
    ]);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [HabtsPage],
      providers: [
        provideLocalePtBr(),
        provideRouter([]),
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        { provide: HabitoService, useValue: habitService },
        { provide: UsuarioService, useValue: usuarioService },
        { provide: HistoricoService, useValue: historicoService },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['openFromComponent']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HabtsPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve retornar lista de habitos', () => {
    // Arrange
    const habitos: Habito[] = [
      {
        id: 1,
        usuario: {
          id: 1,
          nome: 'Diego Battiston',
          email: 'diego@email.com',
          telefone: '11999999999',
          senha: '123456',
          perfil: 'ADMIN',
          status: 'ATIVO',
        },
        nome: 'Beber água',
        meta: 2000,
        icon: 'water_drop',
        color: '#2196F3',
        current: 1200,
        concluidoHoje: false,
      },
    ];
    const usuario = { id: 1, nome: 'Diego', perfil: 'ADMINISTRADOR' };
    usuarioService.getUserLogged.and.returnValue(of(usuario));
    habitService.getHabitos.and.returnValue(of(habitos));
    historicoService.getListHistoricoByDate.and.returnValue(of([]));
    historicoService.getStreak.and.returnValue(of(0));

    // Act
    fixture.detectChanges(); // dispara o ngOnInit

    // Assert
    expect(component.listHabitos.length).toBe(1);
  });

  it('deve retornar lista vazia', () => {
    // Arrange
    const usuario = { id: 1, nome: 'Diego', perfil: 'ADMINISTRADOR' };
    usuarioService.getUserLogged.and.returnValue(of(usuario));
    habitService.getHabitos.and.returnValue(of([]));
    historicoService.getListHistoricoByDate.and.returnValue(of([]));

    // Act
    fixture.detectChanges(); // dispara o ngOnInit

    // Assert
    expect(component.listHabitos).toEqual([]);
  });

  it('mantém concluído ao editar o nome', () => {
    const habit = makeHabit(true);
    loadHabit(habit, true);
    dialog.open.and.returnValue(dialogResult({
      habit: { nome: 'Estudar Java e Spring', meta: 1 },
      icon: habit.icon,
      color: habit.color,
    }) as MatDialogRef<unknown>);
    habitService.editHabitos.and.returnValue(of({ ...habit, nome: 'Estudar Java e Spring', concluidoHoje: false }));

    component.updateHabit(habit.id);

    expect(component.listHabitos[0].nome).toBe('Estudar Java e Spring');
    expect(component.listHabitos[0].concluidoHoje).toBeTrue();
    expect(historicoService.postHistorico).not.toHaveBeenCalled();
  });

  it('mantém concluído ao editar a meta interna', () => {
    const habit = makeHabit(true);
    loadHabit(habit, true);
    dialog.open.and.returnValue(dialogResult({
      habit: { nome: habit.nome, meta: 5 },
      icon: habit.icon,
      color: habit.color,
    }) as MatDialogRef<unknown>);
    habitService.editHabitos.and.returnValue(of({ ...habit, concluidoHoje: false }));

    component.updateHabit(habit.id);

    expect(component.listHabitos[0].concluidoHoje).toBeTrue();
    expect(historicoService.postHistorico).not.toHaveBeenCalled();
  });

  it('mantém concluído ao editar ícone e cor', () => {
    const habit = makeHabit(true);
    loadHabit(habit, true);
    dialog.open.and.returnValue(dialogResult({
      habit: { nome: habit.nome, meta: 1 },
      icon: 'code',
      color: '#FACC15',
    }) as MatDialogRef<unknown>);
    habitService.editHabitos.and.returnValue(of({
      ...habit,
      icon: 'code',
      color: '#FACC15',
      concluidoHoje: false,
    }));

    component.updateHabit(habit.id);

    expect(component.listHabitos[0].concluidoHoje).toBeTrue();
    expect(component.listHabitos[0].icon).toBe('code');
    expect(component.listHabitos[0].color).toBe('#FACC15');
  });

  it('salva a cor preta escolhida no modal de edição', () => {
    const habit = makeHabit(false);
    loadHabit(habit, false);
    dialog.open.and.returnValue(dialogResult({
      habit: { nome: habit.nome, descricao: 'Meditar 10 minutos' },
      icon: 'psychology',
      color: '#0A0A0A',
    }) as MatDialogRef<unknown>);
    habitService.editHabitos.and.returnValue(of({ ...habit, icon: 'psychology', color: '#0A0A0A' }));

    component.updateHabit(habit.id);

    expect(habitService.editHabitos).toHaveBeenCalledWith(
      habit.id,
      jasmine.objectContaining({ color: '#0A0A0A', icon: 'psychology' }),
    );
    expect(component.listHabitos[0].color).toBe('#0A0A0A');
  });

  it('mantém não concluído ao editar um hábito não concluído', () => {
    const habit = makeHabit(false);
    loadHabit(habit, false);
    dialog.open.and.returnValue(dialogResult({
      habit: { nome: 'Hábito atualizado', meta: 1 },
      icon: habit.icon,
      color: habit.color,
    }) as MatDialogRef<unknown>);
    habitService.editHabitos.and.returnValue(of({ ...habit, nome: 'Hábito atualizado' }));

    component.updateHabit(habit.id);

    expect(component.listHabitos[0].concluidoHoje).toBeFalse();
    expect(historicoService.postHistorico).not.toHaveBeenCalled();
  });

  it('recarrega a conclusão do histórico após editar o hábito', () => {
    const habit = makeHabit(true);
    loadHabit(habit, true);
    dialog.open.and.returnValue(dialogResult({
      habit: { nome: 'Hábito após edição', meta: 1 },
      icon: habit.icon,
      color: habit.color,
    }) as MatDialogRef<unknown>);
    habitService.editHabitos.and.returnValue(of({ ...habit, nome: 'Hábito após edição', concluidoHoje: false }));
    habitService.getHabitos.and.returnValue(of([{ ...habit, concluidoHoje: false }]));
    historicoService.getListHistoricoByDate.and.returnValue(of([
      { id: 9, habitoId: habit.id, data: '2026-11-16', concluido: true },
    ]));

    component.updateHabit(habit.id);
    component.recarregarDados();

    expect(component.listHabitos[0].concluidoHoje).toBeTrue();
  });

  function makeHabit(concluido: boolean): Habito {
    return {
      id: 8,
      nome: 'Estudar Java',
      meta: 1,
      icon: 'code',
      color: '#FACC15',
      current: concluido ? 1 : 0,
      concluidoHoje: concluido,
    };
  }

  function loadHabit(habit: Habito, concluido: boolean) {
    const usuario = { id: 1, nome: 'Diego', perfil: 'ADMINISTRADOR' };
    usuarioService.getUserLogged.and.returnValue(of(usuario));
    habitService.getHabitos.and.returnValue(of([habit]));
    historicoService.getListHistoricoByDate.and.returnValue(of(concluido
      ? [{ id: 1, habitoId: habit.id, data: '2026-11-16', concluido: true }]
      : []));
    historicoService.getStreak.and.returnValue(of(0));
    fixture.detectChanges();
  }

  function dialogResult(result: any) {
    return { afterClosed: () => of(result) };
  }
});
