import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {  doc } from 'rxfire/firestore';
import firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class UserdataService {

  constructor(public auth: AngularFireAuth,private db: AngularFirestore) { }
  login() {
    return this.auth.signInWithPopup( new (firebase.auth as any).GoogleAuthProvider());
  }
  logout() {
    return this.auth.signOut();
  }

  ReadTestString(){
    return doc(this.db.firestore.doc('TestCollection/TestIdString'));
  }
  ReadTestStringArr(){
    return doc(this.db.firestore.doc('TestCollection/TestStringArr'));
  }
  ReadTestMap(){
    return doc(this.db.firestore.doc('TestCollection/TestMap'));
  }
  ReadTestMapArr(){
    return doc(this.db.firestore.doc('TestCollection/TestMapArr'));
  }
  incrementby1(){
    const increment = firebase.firestore.FieldValue.increment(1);
    this.db.doc('mylikes/' + 'companyweb').set({ likes: increment },{merge:true});
  }
  Readmylikes(){
    return doc(this.db.firestore.doc('mylikes/companyweb'));
  }
}

