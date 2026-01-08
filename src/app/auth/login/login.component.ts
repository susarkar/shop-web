import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../keycloak.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isAuthenticated = false;
  username: string = 'User Name';

  token = 'default';

  constructor(private keycloakService: KeycloakService) { }

  ngOnInit(): void {
    this.token = this.keycloakService.getToken() || '';
    this.isAuthenticated = !!this.keycloakService.getToken();
  }

  login(): void {
    this.keycloakService.init().then((authenticated) => {
      this.isAuthenticated = authenticated;
      if (authenticated) {
        console.log('User logged in successfully');
      }
    });
  }

  logout(): void {
    this.keycloakService.logout();
    this.isAuthenticated = false;
  }
}