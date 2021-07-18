import {Component, Injector, OnInit, Renderer2} from '@angular/core';
import {AppComponentBase} from '@shared/app-component-base';
import {SignalRAspNetCoreHelper} from '@shared/helpers/SignalRAspNetCoreHelper';
import {LayoutStoreService} from '@shared/layout/layout-store.service';
import {TranslateService} from '@ngx-translate/core';
import {PrimeNGConfig} from 'primeng/api';

@Component({
    templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase implements OnInit {
    sidebarExpanded: boolean;

    constructor(
        injector: Injector,
        private renderer: Renderer2,
        private _layoutStore: LayoutStoreService,
        private translateService: TranslateService,
        private config: PrimeNGConfig
    ) {
        super(injector);
        translateService.addLangs(['tr']);
        translateService.setDefaultLang('tr');
        translateService.use('tr');
        this.translate('tr');
    }
    translate(lang: string) {
        this.translateService.use(lang);
        this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
    }
    ngOnInit(): void {
        this.translateService.setDefaultLang('tr');
        this.renderer.addClass(document.body, 'sidebar-mini');

        SignalRAspNetCoreHelper.initSignalR();

        abp.event.on('abp.notifications.received', (userNotification) => {
            abp.notifications.showUiNotifyForUserNotification(userNotification);

            // Desktop notification
            Push.create('AbpZeroTemplate', {
                body: userNotification.notification.data.message,
                icon: abp.appPath + 'assets/app-logo-small.png',
                timeout: 6000,
                onClick: function () {
                    window.focus();
                    this.close();
                }
            });
        });

        this._layoutStore.sidebarExpanded.subscribe((value) => {
            this.sidebarExpanded = value;
        });
    }

    toggleSidebar(): void {
        this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
    }
}
