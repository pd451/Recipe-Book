import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from  '@angular/core';
import { AuthService } from './auth.service';
import { map , take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({providedIn : 'root'})
export class AuthGuard implements CanActivate { 

    constructor(private authService : AuthService, private router : Router) { }

    canActivate(route : ActivatedRouteSnapshot, router : RouterStateSnapshot):
    boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>{
        return this.authService.user.pipe(
            take(1),
            map(user => {
            const isUser = !!user;
            if (isUser) {
                return true;
            }
            else {
                console.log(route);
                return this.router.createUrlTree(['/auth']);
            }
        }))
    }
}