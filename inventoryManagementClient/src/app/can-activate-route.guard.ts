import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './services/user.service';
import { RouteService } from './services/route.service';

@Injectable({
    providedIn: 'root'
})
export class CanActivateRouteGuard implements CanActivate {

    constructor(private userService: UserService, private routeService: RouteService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const isAuthenticated = this.userService.isUserAuthenticated(this.userService.bearerToken);
        isAuthenticated.subscribe(response => {
            if(!response) {
                this.routeService.routeToLogin();
            }
        }, error => {
            this.routeService.routeToLogin();
        });
        return isAuthenticated;
    }
}
