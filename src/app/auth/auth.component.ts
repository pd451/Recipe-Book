import { Component } from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService , AuthResponseData } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})

export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error : string = null;

    constructor( private authService : AuthService, private router : Router, private route : ActivatedRoute) {  }

    goToReset() {
        this.router.navigate(['auth/reset']);
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form : NgForm, event : any) {
        if (!form.value) {
            return;
        }
        this.isLoading = true;
        const email = form.value.email;
        const password = form.value.password;

        let authObs : Observable<AuthResponseData>;
        if (this.isLoginMode) {
            authObs = this.authService.login(email,password);
        }
        else {
            authObs = this.authService.signup(email,password);
                
        }

        authObs.subscribe(
            resData => {
                console.log(resData);        
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.isLoading = false;
            }
        );

        form.reset();
    }
}