import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  error_msg: string = null;
  constructor(private authService : AuthService, private router : Router) { }


  goToLogin() {
    this.router.navigate(['/auth']);
  }

  ngOnInit(): void {
  }

  onResetPassword(form : NgForm, event : any) {
    const email = form.value.email;

    this.authService.resetPassword(email).subscribe(
      resData => {
        console.log("Reset was successful");
        console.log(resData);        
    },
    errorMessage => {
        console.log(errorMessage);
        this.error_msg = errorMessage;
    }
    );
  }

}
