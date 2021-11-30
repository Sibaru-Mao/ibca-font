import { DataService } from './../services/data.service';
import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {


  constructor(
    private http: DataService,
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    }
    // Get the roles required from the route.
    const requiredRoles = this.keycloak.getUserRoles();
    // this.keycloak.loadUserProfile();

    // keycloak获取的用户登录信息
    let user = await this.keycloak.loadUserProfile()
    // 用户的个人和权限信息
    let man = await this.http.getManInfo()
    man = man.find(i => { return i.User_ID == user['username'].toUpperCase() })
    sessionStorage.setItem('man', JSON.stringify(man))

    // Allow the user to to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }
    // Allow the user to proceed if all the required roles are present.
    return true
    // return true;
  }
}
