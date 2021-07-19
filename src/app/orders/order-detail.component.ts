import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {appModuleAnimation} from '../../shared/animations/routerTransition';

import {Subscription} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {toNumber} from 'lodash-es';
import {DomSanitizer} from '@angular/platform-browser';
import {Product} from '../../shared/models/product.model';
import {ProductService} from '../../shared/services/product.service';
import {CategoryService} from '../../shared/services/category.service';
import {ManufacturerService} from '../../shared/services/manufacturer.service';
import {Manufacturer} from '../../shared/models/manufacturer.model';
import {Category} from '../../shared/models/category.model';
import {DecimalPipe} from '@angular/common';
import {Facility} from '../../shared/models/facility.model';
import {OrderService} from '../../shared/services/order.service';
import {Order} from '../../shared/models/order.model';
import {OrderItem} from '../../shared/models/order-item.model';
import {OrderStatus} from '../../shared/models/order-status.model';


@Component({
    templateUrl: './order-detail.component.html',
    animations: [appModuleAnimation()],
    providers: [OrderService, DecimalPipe]
})
export class OrderDetailComponent implements OnInit, OnDestroy {
    item: Order = new Order();
    orderId: number;
    public imagePath: any;
    orderItemList: OrderItem[] = [];
    orderStatusList: OrderStatus[] = [];
    subscriptions: Subscription[] = [];
    constructor(
        private orderService: OrderService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        private _decimalPipe: DecimalPipe,
        private activatedRoute: ActivatedRoute,
        public router: Router,
        private _modalService: BsModalService
    ) {

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    ngOnInit(): void {
        this.getOrderStatusList();
        this.activatedRoute.paramMap.subscribe((params => {
            this.orderId = toNumber(params.get('orderId'));
            if (params.get('orderId').toLowerCase() !== 'add') {
                this.getItemById(this.orderId);
                this.getOrderItemListByOrderId(this.orderId);
            }
        }));
    }

    getItemById(id: number) {
        const sb = this.orderService.getItemById(id).subscribe(resp => {
            console.log('getItemById ---->>', resp.result);
            this.item = resp.result;
            this.cdr.detectChanges();
        }, (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Veri çekme işlemi',
                detail: 'Kayıtlar alınamadı! Hata:' + JSON.stringify(error)
            });
        }, () => {
        });
        this.subscriptions.push(sb);
    }

    getOrderItemListByOrderId(id: number) {
        const sb2 = this.orderService.getOrderItemListByOrderId(id).subscribe(resp => {
            console.log('getOrderItemListByOrderId ---->>', resp.result);
            this.orderItemList = resp.result.items;
            for (const row of this.orderItemList) {
                row.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + row.product.image.content);
            }
            this.cdr.detectChanges();
        }, (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Veri çekme işlemi',
                detail: 'Kayıtlar alınamadı! Hata:' + JSON.stringify(error)
            });
        }, () => {
        });
        this.subscriptions.push(sb2);
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

    saveOrderStatus() {
        this.orderService.saveOrderStatus(this.item).subscribe(resp => {
            this.messageService.add({
                severity: 'success',
                summary: 'İşlem Durumu',
                detail: 'Kayıt başarıyla kaydedildi'
            });
            // this.router.navigate(['../'], {relativeTo: this.activatedRoute}).then(() => {});
        }, (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'İşlem Durumu',
                detail: 'Hata: ' + error.error.error.message
            });
        });
    }
}
