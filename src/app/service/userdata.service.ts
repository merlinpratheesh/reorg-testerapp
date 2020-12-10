import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {  doc } from 'rxfire/firestore';
import firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class UserdataService {
  nomorelikesflag= false;
  constructor(public auth: AngularFireAuth,private db: AngularFirestore) { }
  login() {
    return this.auth.signInWithPopup( new (firebase.auth as any).GoogleAuthProvider());
  }
  logout() {
    return this.auth.signOut();
  }

}

