import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import * as FullStory from '@fullstory/browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  user: firebase.default.User | null;

  constructor(private auth: AngularFireAuth) {
    auth.user.subscribe(user => {
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
    this.auth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider());
  }

  /**
   * Logout the user.
   */
  logout() {
    this.auth.signOut();
  }

}
