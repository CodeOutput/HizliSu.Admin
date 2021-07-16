import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {appModuleAnimation} from '../../shared/animations/routerTransition';


import {Category} from '../../shared/models/category.model';
import {CategoryService} from '../../shared/services/category.service';
import {Subscription} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {toNumber} from 'lodash-es';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
    templateUrl: './category-detail.component.html',
    animations: [appModuleAnimation()],
    providers: [CategoryService]
})
export class CategoryDetailComponent implements OnInit, OnDestroy {
    item: Category = new Category();
    categoryId: number;
    public imagePath: any;
    subscriptions: Subscription[] = [];

    constructor(
        private categoryService: CategoryService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
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
            this.categoryId = toNumber(params.get('categoryId'));
            if (params.get('categoryId').toLowerCase() !== 'add') {
                this.getItemById(this.categoryId);
            }
        }));
    }

    getItemById(id: number) {
        const sb = this.categoryService.getItemById(id).subscribe(resp => {
            console.log('gategory list ---->>', resp.result);
            this.item = resp.result;
            this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.item.image.content);


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
        if (this.item == null || this.item.sortOrder == null) {
            this.messageService.add({
                severity: 'error',
                summary: 'İşlem Durumu',
                detail: 'Sıralama değeri giriniz!'
            });
            return;
        }

        this.categoryService.saveCategory(this.item).subscribe(resp => {
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


}
