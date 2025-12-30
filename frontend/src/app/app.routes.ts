import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UploadComponent } from './documents/upload/upload.component';
import { ListComponent } from './documents/list/list.component';
import { ProfileComponent } from './profile/profile.component';
import { CompleteProfileComponent } from './profile/complete-profile/complete-profile.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'documents', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'documents',
        component: ListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'documents/folders/:id',
        component: ListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'documents/upload',
        component: UploadComponent,
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },
    {
        path: 'complete-profile',
        component: CompleteProfileComponent,
        canActivate: [authGuard]
    }
];
