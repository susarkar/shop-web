import { KeycloakService } from 'keycloak-angular';
import { Component, inject, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userProfile: any;
  token: string | undefined;

  // keycloakService = inject(KeycloakService);

  constructor() { }

  // ngOnInit(): void {

  //   //console.log('UserName:', this.keycloakService.loadUserProfile());
  //   this.keycloakService.loadUserProfile().then((profile) => {
  //     this.userProfile = profile;
  //     console.log('User Profile:', this.userProfile);
  //   }).catch((error) => {
  //     console.error('Error loading user profile:', error);
  //   });

  //   this.keycloakService.getToken().then((token) => {
  //     this.token = token;
  //     console.log('Token:', this.token);
  //   });
  // }
}
