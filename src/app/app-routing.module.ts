import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {AppRouteGuard} from '@shared/auth/auth-route-guard';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {UsersComponent} from './users/users.component';
import {TenantsComponent} from './tenants/tenants.component';
import {RolesComponent} from 'app/roles/roles.component';
import {ChangePasswordComponent} from './users/change-password/change-password.component';
import {CategoriesComponent} from './categories/categories.component';
import {CategoryDetailComponent} from './categories/category-detail.component';
import {ManufacturersComponent} from './manufacturers/manufacturers.component';
import {ManufacturerDetailComponent} from './manufacturers/manufacturer-detail.component';
import {ProductsComponent} from './products/products.component';
import {ProductDetailComponent} from './products/product-detail.component';
import {CitiesComponent} from './cities/cities.component';
import {CitiesDetailComponent} from './cities/cities-detail.component';
import {OrdersComponent} from './orders/orders.component';
import {OrderDetailComponent} from './orders/order-detail.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    {path: 'home', component: HomeComponent, canActivate: [AppRouteGuard]},
                    {path: 'users', component: UsersComponent, data: {permission: 'Pages.Users'}, canActivate: [AppRouteGuard]},
                    {path: 'roles', component: RolesComponent, data: {permission: 'Pages.Roles'}, canActivate: [AppRouteGuard]},
                    {
                        path: 'categories',
                        component: CategoriesComponent,
                        data: {permission: 'Pages.Roles'},
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'categories/:categoryId',
                        component: CategoryDetailComponent,
                        data: {permission: 'Pages.Roles'},
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'manufacturers',
                        component: ManufacturersComponent,
                        data: {permission: 'Pages.Roles'},
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'manufacturers/:manufacturerId',
                        component: ManufacturerDetailComponent,
                        data: {permission: 'Pages.Roles'},
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'products',
                        component: ProductsComponent,
                        data: {permission: 'Pages.Roles'},
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'products/:productId',
                        component: ProductDetailComponent,
                        data: {permission: 'Pages.Roles'},
                        canActivate: [AppRouteGuard]
                    }, {
                        path: 'orders',
                        component: OrdersComponent,
                        data: {permission: 'Pages.Orders'},
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'orders/:orderId',
                        component: OrderDetailComponent,
                        data: {permission: 'Pages.Orders'},
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'cities',
                        component: CitiesComponent,
                        data: {permission: 'Pages.Roles'},
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'cities/:cityId',
                        component: CitiesDetailComponent,
                        data: {permission: 'Pages.Roles'},
                        canActivate: [AppRouteGuard]
                    },
                    {path: 'tenants', component: TenantsComponent, data: {permission: 'Pages.Tenants'}, canActivate: [AppRouteGuard]},
                    {path: 'about', component: AboutComponent, canActivate: [AppRouteGuard]},
                    {path: 'update-password', component: ChangePasswordComponent, canActivate: [AppRouteGuard]}
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
