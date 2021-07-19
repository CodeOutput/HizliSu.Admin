import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {appModuleAnimation} from '@shared/animations/routerTransition';

import {Subscription} from 'rxjs';
import {ConfirmationService, LazyLoadEvent, MessageService} from 'primeng/api';
import {OrderService} from '../../shared/services/order.service';
import {Order} from '../../shared/models/order.model';
import {Pageable} from '../../shared/models/pageable';
import {OrderStatus} from '../../shared/models/order-status.model';
import {environment} from '../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
// import defaultLanguage from '../../assets/i18n/tr.json';

@Component({
    templateUrl: './orders.component.html',
    animations: [appModuleAnimation()],
    providers: [OrderService]
})
export class OrdersComponent implements OnInit, OnDestroy {
    list: Order[] = [];
    orderStatusList: OrderStatus[] = [];
    search: Order = new Order();
    subscriptions: Subscription[] = [];
    public totalRecords = 0;
    public loading = false;
    public pageable: Pageable = new Pageable();

   constructor(
        injector: Injector,
        private translateService: TranslateService,
        private orderService: OrderService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef,
        private _modalService: BsModalService
    ) {

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    ngOnInit(): void {
        this.getOrderStatusList();
    }

    getOrderStatusList() {
        const sb = this.orderService.getOrderStatusList().subscribe(resp => {
            console.log('getOrderStatusList list ---->>', resp.result.items);
            this.orderStatusList = resp.result.items;
            this.cdr.detectChanges();
        }, (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Veri çekme işlemi',
                detail: 'Kayıtlar alınamadı! Hata:' + JSON.stringify(error)
            });
        });
        this.subscriptions.push(sb);
    }
    getList(event: LazyLoadEvent) {
        console.log(event);

        this.pageable.page = Math.floor(event == null ? 0 : event.first / event.rows);
        this.pageable.page = this.pageable.page > -1 ? this.pageable.page : 0;

        this.pageable.size = event == null ? (this.pageable == null ? 50 : this.pageable.size) : event.rows;

        this.loading = true;
        this.search.resultCount = this.pageable.size;
        this.search.pageNo = this.pageable.page;
        this.cdr.detectChanges();
        const sb = this.orderService.getList(this.search).subscribe(resp => {
            console.log('product list ---->>', resp.result.items);
            this.list = resp.result.items;
            this.totalRecords = resp.result.totalCount;
            this.loading = false;
            this.cdr.detectChanges();
        }, (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Veri çekme işlemi',
                detail: 'Kayıtlar alınamadı! Hata:' + JSON.stringify(error)
            });
        });
        this.subscriptions.push(sb);
    }


    clearSearch() {
        this.search = new Order();
        this.getList(null);
    }
}
