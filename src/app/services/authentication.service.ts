import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Utilities } from './utilities.service';

export class UserInfo {
  publicKey?: string;

  publicKeyHex?: string;

  short?: string;

  authenticated() {
    return !!this.publicKey;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  static UNKNOWN_USER = new UserInfo();

  authInfo$: BehaviorSubject<UserInfo> = new BehaviorSubject<UserInfo>(AuthenticationService.UNKNOWN_USER);

  constructor(private utilities: Utilities, private router: Router) {}

  async login() {
    const gt = globalThis as any;

    const publicKey = await gt.nostr.getPublicKey();
    const user = this.createUser(publicKey);

    localStorage.setItem('blockcore:notes:nostr:pubkey', publicKey);

    this.authInfo$.next(user);
    return user;
  }

  anonymous() {
    const user = new UserInfo();
    user.publicKey = 'anonymous';
    this.authInfo$.next(user);
    return user;
  }

  logout() {
    localStorage.removeItem('blockcore:notes:nostr:pubkey');
    this.authInfo$.next(AuthenticationService.UNKNOWN_USER);
    this.router.navigateByUrl('/connect');
  }

  private createUser(publicKey: string) {
    const user = new UserInfo();
    user.publicKeyHex = publicKey;
    user.publicKey = this.utilities.getNostrIdentifier(publicKey);
    user.short = publicKey.substring(0, 10) + '...'; // TODO: Figure out a good way to minimize the public key, "5...5"?
    return user;
  }

  async getAuthInfo() {
    const publicKey = localStorage.getItem('blockcore:notes:nostr:pubkey');

    if (publicKey) {
      const user = this.createUser(publicKey);
      this.authInfo$.next(user);
      return user;
    } else {
      this.authInfo$.next(AuthenticationService.UNKNOWN_USER);
      return AuthenticationService.UNKNOWN_USER;
    }
  }
}
