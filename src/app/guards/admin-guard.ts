import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { UsuarioService } from '../service/usuario.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const userService = inject(UsuarioService);
  const router = inject(Router);

  const userPerfil = userService.getUserFromLocalStorage();

  if (userPerfil === 'ADMINISTRADOR') {
    return true;
  }

  router.navigate(['/habits']);
  return false;
};
