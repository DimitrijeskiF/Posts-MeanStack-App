import { AuthService } from './../auth/auth.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  authSubscription: Subscription;
  isUserAuthenticated = false;

  constructor(
   private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authSubscription = this.authService.getAuthStateListener()
     .subscribe(isAuthenticated  => {
       this.isUserAuthenticated = isAuthenticated;
     });
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

}
