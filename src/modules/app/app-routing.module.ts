import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { IsAuthenticatedGuard } from './is-authenticated.guard';
import { NotFoundPageComponent } from '../ui/components/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    title: 'App',
    path: '',
    redirectTo: 'pastures-map',
    pathMatch: 'full',
  },
  {
    title: 'Login',
    path: 'login',
    canActivate: [IsAuthenticatedGuard],
    loadChildren: () =>
      import('src/modules/app/modules/login/login.module').then(
        (m) => m.LoginModule
      ),
  },
  {
    title: 'GiproZem',
    path: 'pastures-map',
    data: {
      position: 'top',
      image: 'logo.png',
      class: 'homepage',
    },
    loadChildren: () =>
      import('./modules/pastures-map/pastures-map.module').then(
        (m) => m.PasturesMapModule
      ),
  },
  {
    title: 'Home',
    path: 'pastures-map',
    data: { icon: 'home', class: 'homepage-mobile' },
    loadChildren: () =>
      import('./modules/pastures-map/pastures-map.module').then(
        (m) => m.PasturesMapModule
      ),
  },
  {
    title: 'Cropland',
    path: 'cropland-map',
    data: { position: 'top', icon: 'agriculture' },
    loadChildren: () =>
      import('./modules/cropland-map/cropland-map.module').then(
        (m) => m.CroplandMapModule
      ),
  },
  {
    title: 'Reports',
    path: 'reports',
    data: { position: 'top', icon: 'reports' },
    loadChildren: () =>
      import('./modules/reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    title: 'Dictionary',
    path: 'dictionary',
    data: { position: 'top', icon: 'dictionary' },
    loadChildren: () =>
      import('./modules/dictionary/dictionary.module').then(
        (m) => m.DictionaryModule
      ),
  },
  {
    title: 'About system',
    path: 'about',
    data: { position: 'top', icon: 'info' },
    loadChildren: () =>
      import('./modules/about/about.module').then((m) => m.AboutModule),
  },
  {
    title: 'Profile',
    path: 'profile',
    data: { position: 'bottom', icon: 'user' },
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    title: 'Notifications',
    path: 'notifications',
    data: { position: 'bottom', icon: 'notification', class: 'notification' },
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/notifications/notifications.module').then(
        (m) => m.NotificationsModule
      ),
  },
  {
    title: 'NotFoundPage',
    path: '**',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
