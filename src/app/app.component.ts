import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { UserdataService } from './service/userdata.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'globalstart';
  loggedin:string= undefined;
  readmylikesfromdb:Observable<number>;
  loggedinObs:Observable<string>;
  readstring: Observable<string>=undefined;
  readstringArr: Observable<string[]>;
  readmap: Observable<any>;
  readmapArr:Observable<any[]>;
  imageUrl="../assets/shane-rounce-1ZZ96uESRJQ-unsplash.jpg";
  displayname:string;
  titleDialogRef: MatDialogRef<DialogOverviewExampleDialog>
  @ViewChild('drawer') public sidenav: MatSidenav;
  constructor(public dialog: MatDialog, public afAuth: AngularFireAuth,
    public tutorialService: UserdataService) {
    this.afAuth.authState.pipe(
      map((credential:any) => {
      if (credential !== null) {
        console.log('credential-!null,ReachedLogin-success', credential);        
        this.loggedin='true';
        this.readmylikesfromdb = this.tutorialService.Readmylikes().pipe(map((val:any)=>{
          
          return(val.data());
        }));
        /*
        this.readstring= this.tutorialService.ReadTestString().pipe(map((val:any)=>{
          return(val.data());
        }));
        this.readstringArr= this.tutorialService.ReadTestStringArr().pipe(map((val:any)=>{
          return(val.data());
        }));
        this.readmap= this.tutorialService.ReadTestMap().pipe(map((val:any)=>{
          return(val.data());
        }));
        this.readmapArr= this.tutorialService.ReadTestMapArr().pipe(map((val:any)=>{
          return(val.data());
        }));*/

        this.displayname = credential.displayName;
        return 'true';
      } else{
        console.log('credential-null,ReachedLogout', credential,false);
        this.loggedin='false';//show skeleton & show login screen
        this.titleDialogRef.close();
        this.openDialog('loggedout');
        return 'false';
      }
    })).subscribe(mydata=>{
      if(mydata === 'true'){
        this.titleDialogRef.close();
      }
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
  <div *ngIf="data === 'loggedout'" >
  <div fxLayout="column" fxLayoutAlign="space-around center">
  <h1> Company Information </h1>
  <h1>  Checkout various Projects in pipeline </h1>
  <h1>  Also Browse rolledout Public projects </h1>
  </div>
  <div fxLayout="row " fxLayoutAlign="space-around center">
    <mat-chip-list>
    <mat-chip  style="font-size:2em;" >Login now:</mat-chip>
    </mat-chip-list>
    <button mat-raised-button color="primary" (click)="tutorialService.login()"> Google login</button>
  </div>
  </div>
  <mat-spinner  *ngIf="data !== 'loggedout'"></mat-spinner>
  `
})
export class DialogOverviewExampleDialog {
  mydata='showspinner';
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data:string, public tutorialService: UserdataService) {
      
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
