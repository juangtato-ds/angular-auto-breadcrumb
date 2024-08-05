import { Routes } from '@angular/router';
import { anonymousGuard } from './guard/anonymous.guard';
import { LoginComponent } from './dummy/login/login.component';
import { withSessionChildGuard } from './guard/with-session.guard';
import { AccountPageComponent } from './dummy/account-page/account-page.component';
import { MainPageComponent } from './dummy/main-page/main-page.component';
import { LandingPageComponent } from './dummy/landing-page/landing-page.component';
import { ProfilePageComponent } from './dummy/account-page/profile-page/profile-page.component';
import { IntegrationsPageComponent } from './dummy/account-page/integrations-page/integrations-page.component';
import { CredentialsPageComponent } from './dummy/account-page/credentials-page/credentials-page.component';
import { IntegrationDetailPageComponent } from './dummy/account-page/integrations-page/integration-detail-page/integration-detail-page.component';
import { ParentPageComponent } from './component/parent-page/parent-page.component';


const accountRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile'
    },
    {
        path: 'profile',
        component: ProfilePageComponent,
        data: {
            title: 'Profile',
            breadcrumb: {
                label: 'My Profile'
            }
        }
    },
    {
        path: 'integrations',
        component: IntegrationsPageComponent,
        data: {
            title: 'App. Integrations',
            breadcrumb: {
                label: 'Application Integrations'
            }
        },
        children: [{
            path: ':' + IntegrationDetailPageComponent.TARGET,
            component: IntegrationDetailPageComponent,
            data: {
                breadcrumb: {
                    label: 'loading...',
                    dynamicCode: IntegrationDetailPageComponent.BC_TARGET
                }
            }
        }]
    },
    {
        path: 'credentials',
        component: CredentialsPageComponent,
        data: {
            title: 'Change Credentials',
            breadcrumb: {
                label: 'Change credentials'
            }
        }
    }
];

export const routes: Routes = [
    {
        path: '',
        canActivateChild: [withSessionChildGuard],
        component: MainPageComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: LandingPageComponent
            },
            {
                path: 'account',
                component: AccountPageComponent,
                data: {
                    title: 'My account',
                    breadcrumb: {
                        label: 'My Account',
                        nolink: true
                    }
                },
                children: accountRoutes
            },
            {
                path: 'trick',
                component: ParentPageComponent, // This page has no data but it is useful for the breadcrumb
                data: {
                    breadcrumb: {
                        label: 'Other way',
                        nolink: true
                    }
                },
                children: accountRoutes
            }
        ]
    },
    {
        path: 'login',
        canActivate: [anonymousGuard],
        component: LoginComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
