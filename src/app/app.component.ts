import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable,combineLatest } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, withLatestFrom, switchMap,filter,tap, take } from 'rxjs/operators';
import { UserdataService } from './service/userdata.service';
import { MatSidenav } from '@angular/material/sidenav';
import {userProfile, projectVariables, projectFlags} from './testcaseList/single-testcase/projectTypes';
import { AngularFirestore } from '@angular/fire/firestore';
import { doc } from 'rxfire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  myuserProfile:userProfile={
    UserAuthenObj: undefined,
    ProjectOwner: undefined,
    CurrentProject: undefined,
    mainsubsectionKeys: undefined,
    publicProjectData: undefined,
    ownPublicprojectData: undefined
  }

  myprojectFlags: projectFlags= {    
      showCreateTestcase:undefined,//show add or New Testcase based on number of testcases in subsection
      showPaynmentpage:undefined//for expired user-remove it
  }
  titleDialogRef: MatDialogRef<DialogOverviewExampleDialog>
  @ViewChild('drawer') public sidenav: MatSidenav;
  constructor(
    public dialog: MatDialog, 
    public afAuth: AngularFireAuth,
    public testerApiService: UserdataService,
    private db: AngularFirestore) {
      this.afAuth.authState.pipe(map((authenticationcases: any)=>{
        if(authenticationcases){
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
        filter(authCredentials => authCredentials !== null),
        map((authCredentialsObj:any)=>{
          this.myuserProfile.publicProjectData= doc(this.db.firestore.doc('/projectList/publicProjects')).pipe(
            map((mypublicproject:any)=>{
              return mypublicproject.data().public;
            })
          );

          this.myuserProfile.ownPublicprojectData= doc(this.db.firestore.doc('/projectList/' + this.myuserProfile.UserAuthenObj.uid)).pipe(
            map((myprivateproject:any)=>{
              if(myprivateproject.data() === undefined){
                return null;
              }
              return myprivateproject.data().privateProject;
            })
          );
          this.myuserProfile.mainsubsectionKeys = doc(this.db.firestore.doc('/myProfile/' + this.myuserProfile.UserAuthenObj.uid)).pipe(
            switchMap( (userprofile:any)=>{
                if (userprofile.data() === undefined) {
                  const nextMonth: Date = new Date();
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  const newItem = {
                    MembershipEnd: nextMonth.toDateString(),
                    MembershipType: 'Demo',
                    CurrentProject: '/projectList/DemoProjectKey'
                  };
                  this.db.doc<any>('myProfile/' + this.myuserProfile.UserAuthenObj.uid).set(newItem);       
                  this.myuserProfile.CurrentProject= '/projectList/DemoProjectKey';
                  this.myprojectFlags.showPaynmentpage=false;
                  this.myuserProfile.ProjectOwner=true;
                }else{
                  this.myuserProfile.CurrentProject= userprofile.data().CurrentProject;
                  if (new Date(userprofile.data().MembershipEnd).valueOf() < new Date().valueOf()) {
                    
                    if (userprofile.data().MembershipType === 'Demo') {
                      this.myuserProfile.ProjectOwner=false;
                      this.myprojectFlags.showPaynmentpage=true;
                    }else{
                      const nextMonth: Date = new Date();
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      const newItem = {
                        MembershipEnd: nextMonth.toDateString(),
                        MembershipType: 'Demo',
                        CurrentProject: '/projectList/DemoProjectKey'
                      };
                      this.db.doc<any>('myProfile/' + this.myuserProfile.UserAuthenObj.uid).set(newItem);
                      this.myuserProfile.CurrentProject= '/projectList/DemoProjectKey';
                      this.myprojectFlags.showPaynmentpage=false;
                      this.myuserProfile.ProjectOwner=true;
                    }
                  
                  }else{
                    this.myprojectFlags.showPaynmentpage=false;
                    this.myuserProfile.ProjectOwner=true;
                  }
                }      
              return doc(this.db.firestore.doc(this.myuserProfile.CurrentProject)).pipe(take(1),map((values: any) => {
                const mainsubsectionKeys = [];
                let subSectionKeys = [];
                let savedisabledval=undefined;
                for (const allmainlist in values.data()) {
                  const myval = values.data();
                  myval[allmainlist].forEach(singlesublist => {
                    for (const mission in singlesublist) {
                      subSectionKeys.push({ value: mission, viewValue: mission });
                      savedisabledval = singlesublist[mission];
                    }
                    mainsubsectionKeys.push({
                      name: allmainlist,
                      disabled: savedisabledval,
                      SubSection: subSectionKeys
                    });
                    subSectionKeys = [];
                  });
                }                
                return mainsubsectionKeys;
              }))
            })
          );          
          return authCredentialsObj;
          })).subscribe(afterauthdone=>{
          console.log('afterauthdone',afterauthdone);
        });

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
    this.myuserProfile.UserAuthenObj=undefined;
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
  <h1> <strong style="font-size:30px">Testing tool</strong> </h1>
  <h1>  Checkout various Public projects TestCases </h1>
  <h1>  Also Edit/Create/Delete Testcases in Demo Mode </h1>
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
