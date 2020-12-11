import { Observable, Subscription } from 'rxjs';
import { FormControl} from '@angular/forms'
import firebase from 'firebase/app';

export interface userProfile { 
    userAuthenObj: firebase.User,//Receive User obj after login success
    projectLocation?:string;//Demo or User public project ref
    projectOwner?:boolean;
    projectName?:string
    mainsubsectionKeys?: Observable<mainSectionGroup[]>;
    publicProjectData?: Observable<string[]>;
    ownPublicprojectData?: Observable<string[]>,
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
    showCreateTestcase:boolean,//show add or New Testcase based on number of testcases in subsection
    showPaynmentpage:boolean//for expired user-remove it
}

export interface projectVariables
{
    membershipEndDate?:string,
    typeOfUser?:string, 
    activeProject?:string,
    activeProjectMainsection?:string,
    mainSectionVisiblity?:string,
    activeProjectSubsection?:string,
    activeProjectTestcase?:string,
    googleProfileName?:string,
    authenticationObjectUid?:string
    viewSelectedTestcase?:TestcaseInfo,

    subsectionArraydata?:singleSubsection[],
    testcaseInfodata?: Observable<TestcaseInfo[]>,
    testcaseInfoArraydata?: TestcaseInfo[],

    publicProjectArrayData?: string[],

    authDataSub?:Subscription,
    loadkeySub?:Subscription,
    mainpagekeySub?:Subscription,
    mypubliclistSub?:Subscription,

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
