import { Observable, Subscription } from 'rxjs';
import { FormControl} from '@angular/forms'
import firebase from 'firebase/app';

export interface userProfile { 
    UserAuthenObj: firebase.User,//Receive User obj after login success
    MembershipEnd?: string;//Demo-1 month, Member-1 year
    MembershipType?:string;//Demo/Member/Expired
    CurrentProject:string;//Demo or User public project
   }

export interface TestcaseInfo{
    heading: string;//Heading in testcase list
    subHeading:string;//Sub-Heading in testcase list
    description: string;//Description in testcase view
    stackblitzLink: string;//stackblitzLink in testcase edit/doubleclick
}

export interface singleSubsection {//for keys display
    subsectionName: string;
}
export interface mainSectionGroup {//for keys display
    mainsectionDisabled: boolean;
    mainsectionName: string;
    subsectionArr: singleSubsection[];
}

export interface projectFlags
{
    queryAuthenticationValue:boolean,//show different screens-based on authentication obj
    showCreateTestcase:boolean,//show add or New Testcase based on number of testcases in subsection
    publicProjectOwner:boolean,//Show new/edit/delete testcase button
    showPaynmentpage:boolean//for expired user-remove it

}

export interface projectVariables
{
    membershipEndDate:string,
    typeOfUser:string, 
    activeProject:string,
    activeProjectMainsection:string,
    mainSectionVisiblity:string,
    activeProjectSubsection:string,
    activeProjectTestcase:string,
    googleProfileName:string,
    authenticationObjectUid:string
    viewSelectedTestcase:TestcaseInfo,
    mainsubsectionKeys: Observable<mainSectionGroup[]>,
    subsectionArraydata:singleSubsection[],
    testcaseInfodata: Observable<TestcaseInfo[]>,
    testcaseInfoArraydata: TestcaseInfo[],
    publicProjectData: Observable<string[]>,
    publicProjectArrayData: string[],
    ownPublicprojectData: string[],
    loadkeySub:Subscription,
    mainpagekeySub:Subscription,
    mypubliclistSub:Subscription
}

export interface projectControls{
    subsectionkeysControl: FormControl,//1-Keys come from db and user sub-sec selection will load a doc from demo or public proj
    publicprojectControl: FormControl,//1-User selects a public project
    ownPublicprojectControl: FormControl,//1-User selects own public project
    testcaseInfoControl: FormControl, //Displays the selected Testcase details
    createtestCaseControl: FormControl,//User enters a test case name
    editMainsectionGroupcontrol: FormControl,// user selects a Main section key
    visibilityMainsectionControl: FormControl,// user selects a Main section visibility key
    editSubsectionControl: FormControl  // user selects a Sub section key
}

