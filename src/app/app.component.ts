import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable,combineLatest } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, withLatestFrom, switchMap,filter,tap } from 'rxjs/operators';
import { UserdataService } from './service/userdata.service';
import { MatSidenav } from '@angular/material/sidenav';
import {userProfile, projectVariables} from './testcaseList/single-testcase/projectTypes';
import { AngularFirestore } from '@angular/fire/firestore';
import { doc } from 'rxfire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  myuserProfile:userProfile={
    UserAuthenObj: undefined
  }
  myprojectVariables:projectVariables={
    initalDatafromDBSub: undefined,
    authDataSub: undefined,
  }
  
  titleDialogRef: MatDialogRef<DialogOverviewExampleDialog>
  @ViewChild('drawer') public sidenav: MatSidenav;
  constructor(
    public dialog: MatDialog, 
    public afAuth: AngularFireAuth,
    public testerApiService: UserdataService,
    private db: AngularFirestore) {
      this.myprojectVariables.authDataSub= this.afAuth.authState.pipe(tap((authenticationcases: any)=>{
        console.log('authenticationcases',authenticationcases);
        if(authenticationcases !== null){
          this.myuserProfile.UserAuthenObj=authenticationcases; 
          this.titleDialogRef.close();
          return authenticationcases;
        }else{
          this.titleDialogRef.close();
          this.openDialog('loggedout');
          this.myuserProfile.UserAuthenObj = null;
          return null;
        }
      }),
        filter(u => u !== null),
        map((authCredentialsObj:any)=>{

          this.myprojectVariables.initalDatafromDBSub = combineLatest([
            doc(this.db.firestore.doc('myProfile/' + this.myuserProfile.UserAuthenObj.uid)), 
            doc(this.db.firestore.doc('keysList/publicProjects')),
            doc(this.db.firestore.doc('keysList/' + this.myuserProfile.UserAuthenObj.uid))
            ]).pipe( 
              map((dbresult:any)=>{
                const [profileInfo, publicProjects, privateProjects] = dbresult;
                return {...profileInfo.data(),...publicProjects.data(), ...privateProjects.data() }
              })
              ).subscribe(something=>{
                console.log(something);
              });
        })
        ).subscribe();

  }
  ngOnInit(){
    this.openDialog('loggingin');
  }
  drawerclose() {
    this.sidenav.close();
  }
  draweropen() {

  }
  componentLogOff(){
    this.openDialog('loggedout');
    this.myprojectVariables.authDataSub.unsubscribe();
    this.myprojectVariables.initalDatafromDBSub.unsubscribe();
    this.testerApiService.logout();
  }
  openDialog(status: string): void {
    this.titleDialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: status
    });

    this.titleDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  template:`
  <div *ngIf="data === 'loggedout'"  style="color:blue; padding:0px;" >
  <div fxLayout="column" fxLayoutAlign="space-around center" style="letter-spacing: 20px;">
  <h1> <strong style="font-size:30px">Company Information</strong> </h1>
  <h1>  Checkout various Projects in pipeline </h1>
  <h1>  Also Browse rolledout Public projects </h1>
  </div>
  <div fxLayout="row " fxLayoutAlign="space-around center">
    <mat-chip-list>
    <mat-chip  style="font-size:2em; padding:10px;height: 60px !important;
    " >Login now:</mat-chip>
    </mat-chip-list>
    <button mat-raised-button color="primary" (click)="testerApiService.login()"> Google login</button>
  </div>
  </div>
  <mat-spinner  *ngIf="data !== 'loggedout'"></mat-spinner>
  `
})
export class DialogOverviewExampleDialog {
  mydata='showspinner';
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data:string, public testerApiService: UserdataService) {
      
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
