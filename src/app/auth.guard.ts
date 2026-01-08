import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

export const authGuard: CanActivateFn = async () => {
    const keycloak = inject(KeycloakService);
    return keycloak.isLoggedIn();
};
