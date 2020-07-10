// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * Define configuration options used by the app:
 * production - whether or not this app is running in production
 * localApiRoot - mock files that contain data (i.e. emulate an API resource locally)
 * remoteApiRoot - the API base URL if hosting the backend demo (https://github.com/fullstorydev/api-shoppe-demo)
 * useMockApi - true to use localApi, false to use the remoteApi
 */
export const environment = {
  production: false,
  localApiRoot: '/assets',
  remoteApiRoot: 'http://localhost:3000/api',
  useMockApi: true,
  orgId: '',
  firebase: {
    apiKey: "AIzaSyAIj9o7fb-2KwcN_ptxnZx7KgT_K1cPpO8",
    authDomain: "ng-shoppe.firebaseapp.com",
    databaseURL: "https://ng-shoppe.firebaseio.com",
    projectId: "ng-shoppe",
    storageBucket: "ng-shoppe.appspot.com",
    messagingSenderId: "934374301881",
    appId: "1:934374301881:web:850c4310ddc83d6e863b68",
    measurementId: "G-WNKVY3ERLJ"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
