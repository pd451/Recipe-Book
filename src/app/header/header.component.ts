import { Component, OnInit, OnDestroy } from '@angular/core';
import  { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy {
  private userSub : Subscription;
  loggedIn = false;
  constructor(private dss : DataStorageService, private authService : AuthService, private router : Router 
    , private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {
        this.loggedIn = !!user;
      }
    );
  }

  onLogout() {
    this.authService.logout();
  }

  onSaveData() {
    this.dss.storeRecipes();
  }

  onFetchData() {
    this.dss.fetchRecipes().subscribe();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
