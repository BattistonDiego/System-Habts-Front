import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '../../interface/user.model';
import { UserStateService } from '../../service/user-state.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatMenuModule, MatDividerModule, CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  usuario!: User | null;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private userStateService: UserStateService,
  ) {}

  ngOnInit() {
    this.userStateService.getUsuario().subscribe((usuario) => {
      this.usuario = usuario;
    });
  }

  isAdmin(): boolean {
    return this.usuario?.perfil === 'ADMINISTRADOR';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
