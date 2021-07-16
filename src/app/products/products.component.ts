import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {appModuleAnimation} from '@shared/animations/routerTransition';


import {Product} from '@shared/models/product.model';
import {Subscription} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ProductService} from '@shared/services/product.service';


@Component({
    templateUrl: './products.component.html',
    animations: [appModuleAnimation()],
    providers: [ProductService]
})
export class ProductsComponent implements OnInit, OnDestroy {
    list: Product[] = [];
    search: Product = new Product();
    subscriptions: Subscription[] = [];

    constructor(
        injector: Injector,
        private productService: ProductService,
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
        this.getProductList();
    }

    getProductList() {
        const sb = this.productService.getList(this.search).subscribe(resp => {
            console.log('product list ---->>', resp.result.items);
            this.list = resp.result.items;
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

    deleteConfirm(event: Event, item: Product) {
        this.confirmationService.confirm({
            target: event.target,
            acceptLabel: 'Evet',
            rejectLabel: 'Hayır',
            message: item.name + ' adlı kaydı silmek istediğinizden emin misiniz?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteRow(item);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'İptal',
                    detail: 'Silme işlemi iptal edilmiştir!'
                });
            }
        });
    }

    deleteRow(item: Product) {

        const sb = this.productService.deleteRowProduct(item.id).subscribe(resp => {
            this.getProductList();
            this.messageService.add({
                severity: 'info',
                summary: 'Kayıt Silme Durumu',
                detail: 'Kayıt başarıyla silinmiştir!'
            });
            this.cdr.detectChanges();
        }, (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Kayıt Silme Durumu',
                detail: 'Kayıt silinemedi! Hata:' + error.error.error.message
            });
        });
        this.subscriptions.push(sb);
    }
}
