import { inject } from '@angular/core';
import {
    HttpInterceptorFn,
    HttpRequest,
    HttpHandlerFn,
    HttpEvent
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';

export const keycloakTokenInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const keycloak = inject(KeycloakService);

    return from(keycloak.getToken()).pipe(
        switchMap((token) => {
            const cloned = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next(cloned);
        })
    );
};
