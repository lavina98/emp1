import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';

import { HttpModule } from '@angular/http'
import { IonicStorageModule } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { RegisterPage,OtpPage } from '../pages/register/register';
import { SearchJobsPage, ModalContentPage } from '../pages/search-jobs/search-jobs';
import { JobDetailPage } from '../pages/job-detail/job-detail';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { UpdateProfilePage, UpdatePasswordPage, UpdateCitiesPage } from '../pages/update-profile/update-profile';
import { InternationalPlacementPage } from '../pages/international-placement/international-placement';
import { JobsAppliedPage } from '../pages/jobs-applied/jobs-applied';
import { CateringJobsPage } from '../pages/catering-jobs/catering-jobs';
import { ProfilePicPage } from '../pages/profile-pic/profile-pic';
import { WorkExperiencePage,DesignationPage} from '../pages/work-experience/work-experience';
import { OtherDetailPage, PopoverPageExp } from '../pages/other-detail/other-detail';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { ScheduledInterviewPage } from '../pages/scheduled-interview/scheduled-interview';
import { ScheduleInterviewPage } from '../pages/schedule-interview/schedule-interview';
import { IntroPage } from '../pages/intro/intro';
import { UploadResumePage } from '../pages/upload-resume/upload-resume';
import { ResumeBuilderPage } from '../pages/resume-builder/resume-builder';
import { UrgentNeedPage } from '../pages/urgent-need/urgent-need';
import { PaymentOptionsPage }  from '../pages/payment-options/payment-options';
import { ReferAFriendPage, CheckReferralPage } from '../pages/refer-a-friend/refer-a-friend';
import { CityPage,EducationPage } from '../pages/city/city';
import { Toast } from '@ionic-native/toast';
import { Data } from '../providers/data';
import { City } from '../providers/city';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { Facebook,FacebookLoginResponse} from '@ionic-native/facebook'
// import { GoogleMaps,
//          GoogleMap,
//          GoogleMapsEvent,
//          LatLng,
//          CameraPosition,
//          MarkerOptions,
//          Marker} from '@ionic-native/google-maps';
import { HeaderColor } from '@ionic-native/header-color';         
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppVersion } from '@ionic-native/app-version';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { OneSignal } from '@ionic-native/onesignal';
import { Network } from '@ionic-native/network';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';
import { Calendar } from '@ionic-native/calendar';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { DatePipe } from '@angular/common';	
import { NetworkServiceProvider } from '../providers/network-service/network-service';
import { BackButtonProvider } from '../providers/back-button/back-button';
import { AboutUsPage } from '../pages/about-us/about-us';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { TermsConditionsPage } from '../pages/terms-conditions/terms-conditions';
import { MymanagerPage } from "../pages/mymanager/mymanager";
import { UpdateDesignationPage } from "../pages/update-designation/update-designation";
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TermsConditionsPage,
    PrivacyPolicyPage,
    AboutUsPage,
    LoginPage,
    OtpPage,
    DesignationPage,
    EducationPage,
    RegisterPage,
    SearchJobsPage,
    JobDetailPage,
    DashboardPage,
    UpdateProfilePage,
    InternationalPlacementPage,
    JobsAppliedPage,
    CateringJobsPage,
    ProfilePicPage,
    NotificationsPage,
    ScheduledInterviewPage,
    UpdatePasswordPage,
    ModalContentPage,
    ForgotPasswordPage,
    ScheduleInterviewPage,
    IntroPage,
    PaymentOptionsPage,
    ReferAFriendPage,
    CheckReferralPage,
    UpdateCitiesPage,
    WorkExperiencePage,
    OtherDetailPage,
    CityPage,
    UploadResumePage,
    ResumeBuilderPage,
    UrgentNeedPage,
    PopoverPageExp,
    MymanagerPage,
    UpdateDesignationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AboutUsPage,
    TermsConditionsPage,
    PrivacyPolicyPage,
    LoginPage,
    PopoverPageExp,
    RegisterPage,
    SearchJobsPage,
    JobDetailPage,
    DashboardPage,
    UpdateProfilePage,
    InternationalPlacementPage,
    JobsAppliedPage,
    CateringJobsPage,
    ProfilePicPage,
    NotificationsPage,
    ScheduledInterviewPage,
    UpdatePasswordPage,
    ModalContentPage,
    ForgotPasswordPage,
    ScheduleInterviewPage,
        OtpPage,
    DesignationPage,
    EducationPage,
    IntroPage,
    PaymentOptionsPage,
    ReferAFriendPage,
    CheckReferralPage,
    UpdateCitiesPage,
    WorkExperiencePage,
    OtherDetailPage,
    CityPage,
    UploadResumePage,
    ResumeBuilderPage,
    UrgentNeedPage,
    MymanagerPage,
    UpdateDesignationPage
  ],
  providers: [
              Toast,
              Data,
              City,
              NetworkServiceProvider,
      StatusBar,
      FileTransfer,
      FileChooser,
      FilePath,
      InAppBrowser,
      AppVersion,
      GoogleAnalytics,
      OneSignal,
      Network,    
      Contacts,
      SocialSharing,
      //GoogleMaps,
      Facebook,
      GooglePlus,
      Diagnostic,
      Calendar,
      NativeStorage,
      Geolocation,
      DatePipe,
      HeaderColor,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BackButtonProvider,
   

  ]
})
export class AppModule {}


