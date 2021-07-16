import {Input, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientJsonpModule} from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';
import {ModalModule} from 'ngx-bootstrap/modal';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {NgxPaginationModule} from 'ngx-pagination';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceProxyModule} from '@shared/service-proxies/service-proxy.module';
import {SharedModule} from '@shared/shared.module';
import {HomeComponent} from '@app/home/home.component';
import {AboutComponent} from '@app/about/about.component';
// tenants
import {TenantsComponent} from '@app/tenants/tenants.component';
import {CreateTenantDialogComponent} from './tenants/create-tenant/create-tenant-dialog.component';
import {EditTenantDialogComponent} from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
import {RolesComponent} from '@app/roles/roles.component';
import {CreateRoleDialogComponent} from './roles/create-role/create-role-dialog.component';
import {EditRoleDialogComponent} from './roles/edit-role/edit-role-dialog.component';
// users
import {UsersComponent} from '@app/users/users.component';
import {CreateUserDialogComponent} from '@app/users/create-user/create-user-dialog.component';
import {EditUserDialogComponent} from '@app/users/edit-user/edit-user-dialog.component';
import {ChangePasswordComponent} from './users/change-password/change-password.component';
import {ResetPasswordDialogComponent} from './users/reset-password/reset-password.component';
// layout
import {HeaderComponent} from './layout/header.component';
import {HeaderLeftNavbarComponent} from './layout/header-left-navbar.component';
import {HeaderLanguageMenuComponent} from './layout/header-language-menu.component';
import {HeaderUserMenuComponent} from './layout/header-user-menu.component';
import {FooterComponent} from './layout/footer.component';
import {SidebarComponent} from './layout/sidebar.component';
import {SidebarLogoComponent} from './layout/sidebar-logo.component';
import {SidebarUserPanelComponent} from './layout/sidebar-user-panel.component';
import {SidebarMenuComponent} from './layout/sidebar-menu.component';
import {CategoriesComponent} from './categories/categories.component';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {TableModule} from 'primeng/table';
import {FileUploadModule} from 'primeng/fileupload';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog';
import {CategoryDetailComponent} from './categories/category-detail.component';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TooltipModule} from 'primeng/tooltip';
import {ToastModule} from 'primeng/toast';
import {ManufacturersComponent} from './manufacturers/manufacturers.component';
import {ManufacturerDetailComponent} from './manufacturers/manufacturer-detail.component';
import {ProductsComponent} from './products/products.component';
import {ProductDetailComponent} from './products/product-detail.component';
import {DropdownModule} from 'primeng/dropdown';
import {TabViewModule} from 'primeng/tabview';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CitiesComponent} from './cities/cities.component';
import {CitiesDetailComponent} from './cities/cities-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        // tenants
        TenantsComponent,
        CreateTenantDialogComponent,
        EditTenantDialogComponent,
        // roles
        RolesComponent,
        CreateRoleDialogComponent,
        EditRoleDialogComponent,
        // users
        UsersComponent,
        CreateUserDialogComponent,
        EditUserDialogComponent,
        ChangePasswordComponent,
        ResetPasswordDialogComponent,
        // categories
        CategoriesComponent,
        CategoryDetailComponent,
        // Manufacturers
        ManufacturersComponent,
        ManufacturerDetailComponent,
        // Products
        ProductsComponent,
        ProductDetailComponent,
        // address
        CitiesComponent,
        CitiesDetailComponent,

        // layout
        HeaderComponent,
        HeaderLeftNavbarComponent,
        HeaderLanguageMenuComponent,
        HeaderUserMenuComponent,
        FooterComponent,
        SidebarComponent,
        SidebarLogoComponent,
        SidebarUserPanelComponent,
        SidebarMenuComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        ModalModule.forChild(),
        BsDropdownModule,
        CollapseModule,
        TabsModule,
        AppRoutingModule,
        ServiceProxyModule,
        SharedModule,
        NgxPaginationModule,
        ConfirmPopupModule,
        TableModule,
        DialogModule,
        CheckboxModule,
        FileUploadModule,
        InputTextModule,
        TooltipModule,
        ToastModule,
        DropdownModule,
        TabViewModule,
        InputTextareaModule
    ],
    providers: [
        ConfirmationService,
        MessageService
    ],
    entryComponents: [
        // tenants
        CreateTenantDialogComponent,
        EditTenantDialogComponent,
        // roles
        CreateRoleDialogComponent,
        EditRoleDialogComponent,
        // users
        CreateUserDialogComponent,
        EditUserDialogComponent,
        ResetPasswordDialogComponent,
    ],
})
export class AppModule {
}
