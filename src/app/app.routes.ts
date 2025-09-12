import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { CreateTriclope } from './routes/create-triclope/create-triclope';
import { TriclopeDetailsComponent } from './routes/triclope-details/triclope-details.component';
import { MesDonsComponent } from './routes/mes-dons/mes-dons.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'create-triclope', component: CreateTriclope },
    { path: 'triclope/:id', component: TriclopeDetailsComponent },
    { path: 'mes-dons', component: MesDonsComponent },
    { path: '**', redirectTo: '' }
];
