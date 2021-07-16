import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {appModuleAnimation} from '@shared/animations/routerTransition';


import {Category} from '@shared/models/category.model';
import {CategoryService} from '@shared/services/category.service';
import {Subscription} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';


@Component({
    templateUrl: './categories.component.html',
    animations: [appModuleAnimation()],
    providers: [CategoryService]
})
export class CategoriesComponent implements OnInit, OnDestroy {
    list: Category[] = [];
    search: Category = new Category();
    subscriptions: Subscription[] = [];

    constructor(
        injector: Injector,
        private categoryService: CategoryService,
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
        this.getCategoryList();
    }

    getCategoryList() {
        const sb = this.categoryService.getList(this.search).subscribe(resp => {
            console.log('gategory list ---->>', resp.result.items);
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

    deleteConfirm(event: Event, item: Category) {
        this.confirmationService.confirm({
            target: event.target,
            acceptLabel: 'Evet',
            rejectLabel: 'Hayır',
            message: item.name + ' adlı kategoriyi silmek istediğinizden emin misiniz?',
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

    deleteRow(item: Category) {

        const sb = this.categoryService.deleteRowCategory(item.id).subscribe(resp => {
            this.getCategoryList();
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
