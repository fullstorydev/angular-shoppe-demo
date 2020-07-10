import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth as Auth, User } from 'firebase/app';
import * as FullStory from '@fullstory/browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  user: User | null;

  constructor(private afa: AngularFireAuth) {
    afa.user.subscribe(user => {
      this.user = user;

      if (user) {
        const { uid, displayName, email } = user;
        FullStory.identify(uid, { displayName, email });
      }
    });
  }

  /**
   * Log in using Google OAuth.
   */
  login() {
    this.afa.signInWithPopup(new Auth.GoogleAuthProvider());
  }

  /**
   * Logout the user.
   */
  logout() {
    this.afa.signOut();
  }

}
