import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersPage } from './users-page';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';
import { User } from '../../interface/user.model';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

describe('UsersPage', () => {
  let component: UsersPage;
  let fixture: ComponentFixture<UsersPage>;

  let usuarioService: jasmine.SpyObj<UsuarioService>;

  beforeEach(async () => {
    usuarioService = jasmine.createSpyObj('UsuarioService', ['getAllUsers', 'getResume']);
    await TestBed.configureTestingModule({
      imports: [UsersPage],
      providers: [
        provideRouter([]),
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        { provide: UsuarioService, useValue: usuarioService },
        { provide: MatDialog, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    usuarioService.getAllUsers.and.returnValue(of({ content: [], totalElements: 0 }));
    usuarioService.getResume.and.returnValue(of(null));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve setar inativos e ativos quando getResume carregar', () => {
    // Arrange
    const resumo = { ativos: 10, inativos: 3 };
    usuarioService.getAllUsers.and.returnValue(of({ content: [], totalElements: 0 }));
    usuarioService.getResume.and.returnValue(of(resumo));

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.activeUsers).toBe(10);
    expect(component.inactiveUsers).toBe(3);
  });
});
