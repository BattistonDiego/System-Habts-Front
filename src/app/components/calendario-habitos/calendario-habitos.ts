import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import {
  Activity,
  Book,
  Brain,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Code,
  Droplet,
  Footprints,
  Languages,
  LucideAngularModule,
  LucideIconData,
  Minus,
  Moon,
  Target,
} from 'lucide-angular';
import { HistoricoService } from '../../service/historico.service';
import { CalendarioMesResponse } from '../../interface/historico.model';
import {
  ColunaDia,
  IconeHabito,
  Periodo,
  compararPeriodos,
  dataLocalIso,
  montarCalendario,
  nomeDoMes,
  periodoAnterior,
  periodoDe,
  proximoPeriodo,
} from './calendario-habitos.calculo';

type EstadoCarregamento = 'carregando' | 'pronto' | 'erro';

@Component({
  selector: 'app-calendario-habitos',
  imports: [LucideAngularModule],
  templateUrl: './calendario-habitos.html',
  styleUrl: './calendario-habitos.scss',
})
export class CalendarioHabitosComponent {
  private readonly historicoService = inject(HistoricoService);
  private readonly injector = inject(Injector);
  private readonly areaDias = viewChild<ElementRef<HTMLElement>>('areaDias');

  private readonly hoje = new Date();
  private readonly hojeIso = dataLocalIso(this.hoje);
  readonly periodoAtual = periodoDe(this.hoje);

  private readonly periodo$ = new BehaviorSubject<Periodo>(this.periodoAtual);

  readonly periodo = signal<Periodo>(this.periodoAtual);
  readonly selecionado = signal<string | null>(this.hojeIso);
  readonly estado = signal<EstadoCarregamento>('carregando');
  private readonly resposta = signal<CalendarioMesResponse | null>(null);

  readonly calendario = computed(() => {
    const resposta = this.resposta();
    return resposta ? montarCalendario(resposta, this.hoje, this.selecionado()) : null;
  });

  readonly podeAvancar = computed(() => compararPeriodos(this.periodo(), this.periodoAtual) < 0);

  readonly tituloMes = computed(() => {
    const { ano, mes } = this.periodo();
    return `${this.capitalizar(nomeDoMes(mes))} ${ano}`;
  });

  readonly subtitulo = computed(() => {
    const cal = this.calendario();
    if (!cal) return '';
    const conclusoes = `${cal.totalConclusoes} ${cal.totalConclusoes === 1 ? 'conclusão' : 'conclusões'}`;
    const dias = `${cal.diasElegiveis} ${cal.diasElegiveis === 1 ? 'dia' : 'dias'}`;
    return cal.mesAtual ? `${conclusoes} em ${dias} até hoje` : `${conclusoes} em ${dias}`;
  });

  readonly icones: Record<IconeHabito, LucideIconData> = {
    water: Droplet,
    book: Book,
    workout: Activity,
    code: Code,
    brain: Brain,
    translate: Languages,
    sleep: Moon,
    walk: Footprints,
    padrao: Target,
  };

  readonly ui = {
    anterior: ChevronLeft,
    proximo: ChevronRight,
    check: Check,
    traco: Minus,
    calendario: CalendarDays,
  };

  constructor() {
    this.periodo$
      .pipe(
        distinctUntilChanged((a, b) => compararPeriodos(a, b) === 0),
        tap(() => {
          this.estado.set('carregando');
          this.resposta.set(null);
        }),
        switchMap(({ ano, mes }) =>
          this.historicoService.buscarMes(ano, mes).pipe(catchError(() => of(null))),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((resposta) => {
        this.resposta.set(resposta);
        this.estado.set(resposta ? 'pronto' : 'erro');
        if (resposta) this.rolarParaSelecionadoAposRender();
      });
  }

  mesAnterior(): void {
    this.irPara(periodoAnterior(this.periodo()));
  }

  proximoMes(): void {
    if (!this.podeAvancar()) return;
    this.irPara(proximoPeriodo(this.periodo()));
  }

  irParaHoje(): void {
    this.irPara(this.periodoAtual);
    this.rolarParaSelecionadoAposRender();
  }

  selecionarDia(coluna: ColunaDia): void {
    if (coluna.futuro) return;
    this.selecionado.set(coluna.data);
  }

  capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  /** No mês atual o dia selecionado é hoje; em meses passados não há seleção. */
  private irPara(periodo: Periodo): void {
    const ehMesAtual = compararPeriodos(periodo, this.periodoAtual) === 0;
    this.selecionado.set(ehMesAtual ? this.hojeIso : null);
    this.periodo.set(periodo);
    this.periodo$.next(periodo);
  }

  /**
   * Rola a área dos dias só o necessário para o dia selecionado ficar visível
   * (começa do dia 1; sem seleção, volta ao início).
   */
  private rolarParaSelecionadoAposRender(): void {
    afterNextRender(
      () => {
        const area = this.areaDias()?.nativeElement;
        if (!area) return;
        const coluna = area.querySelector<HTMLElement>('.coluna-dia.selecionada');
        if (!coluna) {
          area.scrollLeft = 0;
          return;
        }
        const folga = 8;
        const fimColuna = coluna.offsetLeft + coluna.offsetWidth + folga;
        if (fimColuna > area.scrollLeft + area.clientWidth) {
          area.scrollLeft = fimColuna - area.clientWidth;
        } else if (coluna.offsetLeft - folga < area.scrollLeft) {
          area.scrollLeft = Math.max(0, coluna.offsetLeft - folga);
        }
      },
      { injector: this.injector },
    );
  }
}
