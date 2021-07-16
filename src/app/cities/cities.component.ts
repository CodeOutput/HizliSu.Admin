import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {Category} from '@shared/models/category.model';
import {Subscription} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CityService} from '../../shared/services/city.service';
import {City} from '../../shared/models/city.model';


@Component({
    templateUrl: './cities.component.html',
    animations: [appModuleAnimation()],
    providers: [CityService]
})
export class CitiesComponent implements OnInit, OnDestroy {
    list: City[] = [];
    search: City = new City();
    subscriptions: Subscription[] = [];

    constructor(
        injector: Injector,
        private cityService: CityService,
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
        this.getList();
    }

    getList() {
        const sb = this.cityService.getList(this.search).subscribe(resp => {
            console.log('cityService list ---->>', resp.result.items);
            this.list = resp.result.items;
            this.cdr.detectChanges();
        }, (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Veri çekme işlemi',
                detail: 'Kayıtlar alınamadı! Hata:' + error.error.error.message
            });
        });
        this.subscriptions.push(sb);
    }

    deleteConfirm(event: Event, item: Category) {
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

    deleteRow(item: Category) {
        const sb = this.cityService.deleteRow(item.id).subscribe(resp => {
            this.getList();
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
