import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError , tap, take} from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router, ActivatedRoute } from '@angular/router';


export interface AuthResponseData {
    kind: string;
    idToken: string; 
    email : string; 
    refreshToken : string; 
    expiresIn: string;
    localId: string;
    registered? : boolean;
}

@Injectable({providedIn : 'root'})

export class AuthService {
    user = new BehaviorSubject<User>(null);
    exprTimer : any;
    constructor (private http : HttpClient, private route : ActivatedRoute, 
        private router : Router) { }

    signup(email : string, password : string) {
        return this.http.post<AuthResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAzhqoAswWiggivjrPyK15R9pr1DtomJV0',
        {email : email,
        password : password,
        returnSecureToken : true}
        )
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(resData.email , resData.localId, resData.idToken, +resData.expiresIn);
            })
        )
        ;
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/', 'auth']);
        localStorage.removeItem('userData');
        if (this.exprTimer) {
            clearTimeout(this.exprTimer);
        }
        this.exprTimer = null;
    }

    autoLogout(exprTime : number) {
        this.exprTimer = setTimeout(
            () => {
                this.logout();
            }, exprTime
        );
        
    }

    login(email : string , password : string) {
        return this.http.post<AuthResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAzhqoAswWiggivjrPyK15R9pr1DtomJV0',
        {email : email,
            password : password,
            returnSecureToken : true}
        )
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(resData.email , resData.localId, resData.idToken, +resData.expiresIn);
            })
        )
        ;
    }

    resetPassword(email : string) {
        return this.http.post<AuthResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAzhqoAswWiggivjrPyK15R9pr1DtomJV0',
        {   email : email,
            requestType : "PASSWORD_RESET"}
        )
        .pipe(
            take(1),
            catchError(this.handleError), 
            tap(resData => {})
        )
        ;    
    }

    autoLogin() {
        const userData : {
            email : string, 
            id : string,
            _token : string, 
            _tokenExpiration : string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {return;}
        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpiration)
        );
        if (loadedUser) {
            this.user.next(loadedUser);
            const time1 = new Date(userData._tokenExpiration).getTime() - new Date().getTime();
            this.autoLogout(time1);
            console.log(time1);
        }
    }

    private handleAuthentication(email : string, userId : string, token : string, expiresIn : number) {
        const exprDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, exprDate);
        this.user.next(user);   
        this.autoLogout(expiresIn * 1000); 
        localStorage.setItem('userData' , JSON.stringify(user));
    }

    private handleError(errorRes : HttpErrorResponse) {
            let errorMessage = 'An unknown error occurred';
            if (!errorRes.error || !errorRes.error.error) {
                return throwError(errorMessage);
            }
            else {
                switch(errorRes.error.error.message) {
                    case 'EMAIL_EXISTS':
                        errorMessage = 'This email exists already';
                        break;
                    case 'EMAIL_NOT_FOUND':
                        errorMessage = 'An account with this email does not exist';
                        break;
                    case 'INVALID_PASSWORD':
                        errorMessage = 'Wrong Password';
                        break;
                }
                return throwError(errorMessage);
        }
    }
}