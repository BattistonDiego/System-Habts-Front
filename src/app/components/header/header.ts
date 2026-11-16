import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '../../interface/user.model';
import { UserStateService } from '../../service/user-state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatMenuModule, MatDividerModule, CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  usuario$!: Observable<User | null>;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private userStateService: UserStateService,
  ) {}

  ngOnInit() {
    this.usuario$ = this.userStateService.getUsuario();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
