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


@Component({
    templateUrl: './order-detail.component.html',
    animations: [appModuleAnimation()],
    providers: [ProductService, CategoryService, ManufacturerService, DecimalPipe]
})
export class OrderDetailComponent implements OnInit, OnDestroy {
    item: Product = new Product();
    productId: number;
    public imagePath: any;
    manufacturerList: Manufacturer[] = [];
    facilityList: Facility[] = [];
    categoryList: Category[] = [];
    subscriptions: Subscription[] = [];

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private manufacturerService: ManufacturerService,
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
        this.activatedRoute.paramMap.subscribe((params => {
            this.productId = toNumber(params.get('productId'));
            if (params.get('productId').toLowerCase() !== 'add') {
                this.getItemById(this.productId);
            }
        }));
        this.getCategoryList();
        this.getManufacturerList();
    }

    getItemById(id: number) {
        const sb = this.productService.getItemById(id).subscribe(resp => {
            console.log('gategory list ---->>', resp.result);
            this.item = resp.result;
            this.item.unitPrice = +(this.item.price / this.item.unitQuantity).toFixed(2);
            this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.item.image.content);
            this.cdr.detectChanges();
        }, (error) => {
            // this.loading = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Veri çekme işlemi',
                detail: 'Kayıtlar alınamadı! Hata:' + JSON.stringify(error)
            });
        }, () => {
            this.getListByManufacturerId(this.item.manufacturerId);
        });
        this.subscriptions.push(sb);
    }

    getListByManufacturerId(id: number) {
        if (id == null) {
            this.facilityList = [];
            this.cdr.detectChanges();
            return;
        }
        const sb = this.manufacturerService.getListByManufacturerId(id).subscribe(resp => {
            console.log('getListByManufacturerId list ---->>', resp.result);
            this.facilityList = resp.result.items;
            this.cdr.detectChanges();
        }, (error) => {
            // this.loading = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Veri çekme işlemi',
                detail: 'Kayıtlar alınamadı! Hata:' + JSON.stringify(error)
            });
        });
        this.subscriptions.push(sb);
    }

    fileUpload(event: any) {
        if (event.files.length === 0) {
            console.log('Hiç bir dosya seçilmedi.');
            return;
        }
        this.item.file = event.files[0];
    }

    saveRow() {

        this.productService.saveProduct(this.item).subscribe(resp => {
            this.messageService.add({
                severity: 'success',
                summary: 'İşlem Durumu',
                detail: 'Kayıt başarıyla kaydedildi'
            });
            this.router.navigate(['../'], {relativeTo: this.activatedRoute}).then(() => {
            });
        }, (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'İşlem Durumu',
                detail: 'Hata: ' + error.error.error.message
            });
        });
    }

    getManufacturerList() {
        const sb = this.manufacturerService.getList(new Manufacturer()).subscribe(resp => {
            console.log('Manufacturer list ---->>', resp.result.items);
            this.manufacturerList = resp.result.items;
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

    getCategoryList() {
        const sb = this.categoryService.getList(new Category()).subscribe(resp => {
            console.log('Category list ---->>', resp.result.items);
            this.categoryList = resp.result.items;
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

    calc(item: Product) {
        if (item.price != null && item.unitQuantity != null && item.unitQuantity > 0) {
            item.unitPrice = +(item.price / item.unitQuantity).toFixed(2);
            // item.unitPriceStr = this._decimalPipe.transform(item.unitPrice, '1.2-2');
        }
    }
}
