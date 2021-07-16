import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {appModuleAnimation} from '../../shared/animations/routerTransition';

import {Subscription} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {toNumber} from 'lodash-es';
import {DomSanitizer} from '@angular/platform-browser';
import {Manufacturer} from '../../shared/models/manufacturer.model';
import {ManufacturerService} from '../../shared/services/manufacturer.service';
import {Facility} from '../../shared/models/facility.model';
import {Category} from '../../shared/models/category.model';
import {FacilityAttribute} from '../../shared/models/facility-attribute.model';


@Component({
    templateUrl: './manufacturer-detail.component.html',
    animations: [appModuleAnimation()],
    providers: [ManufacturerService]
})
export class ManufacturerDetailComponent implements OnInit, OnDestroy {
    item: Manufacturer = new Manufacturer();
    facility: Facility = new Facility();
    facilityAttribute: FacilityAttribute = new FacilityAttribute();
    manufacturerId: number;
    public imagePath: any;
    list: Facility[] = [];
    subscriptions: Subscription[] = [];
    activeIndex = 0;
    displayPopup = false;
    displayFacilityAttributePopup = false;

    constructor(
        private manufacturerService: ManufacturerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
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
            this.manufacturerId = toNumber(params.get('manufacturerId'));
            if (params.get('manufacturerId').toLowerCase() !== 'add') {
                this.getItemById(this.manufacturerId);
            }
        }));
    }

    getItemById(id: number) {
        const sb = this.manufacturerService.getItemById(id).subscribe(resp => {
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
        }, () => {
            this.getListByManufacturerId(this.item.id);
        });
        this.subscriptions.push(sb);
    }

    getListByManufacturerId(manufacturerId: number) {
        const sb = this.manufacturerService.getListByManufacturerId(manufacturerId).subscribe(resp => {
            console.log('items list ---->>', resp.result);
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

        this.manufacturerService.saveManufacturer(this.item).subscribe(resp => {
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    addOrUpdateFacility(item: Facility) {
        this.displayPopup = true;
        if (item == null) {
            this.facility = new Facility();
        } else {
            const row = JSON.stringify(item);
            this.facility = JSON.parse(row);
        }
    }

    saveFacility() {
        if (this.facility == null || this.facility.name == null || this.facility.name === '') {
            this.messageService.add({
                severity: 'error',
                summary: 'İşlem Durumu',
                detail: 'Tesis adını giriniz!'
            });
            return;
        }
        this.facility.manufacturerId = this.item.id;
        this.manufacturerService.saveFacility(this.facility).subscribe(resp => {
            this.messageService.add({
                severity: 'success',
                summary: 'İşlem Durumu',
                detail: 'Kayıt başarıyla kaydedildi'
            });
            this.displayPopup = false;
            this.getListByManufacturerId(this.item.id);

        }, (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'İşlem Durumu',
                detail: 'Hata: ' + error.error.error.message
            });
        });
    }


    deleteConfirm(event: Event, row: Facility) {
        this.confirmationService.confirm({
            target: event.target,
            acceptLabel: 'Evet',
            rejectLabel: 'Hayır',
            message: row.name + ' adlı kadyı silmek istediğinizden emin misiniz?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteRow(row);
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

    deleteRow(row: Facility) {

        const sb = this.manufacturerService.deleteRowFacility(row.id).subscribe(resp => {
            this.getListByManufacturerId(this.item.id);
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    addOrUpdateFacilityAttribute(facility: Facility, facilityAttribute: FacilityAttribute) {
        this.displayFacilityAttributePopup = true;
        if (facilityAttribute == null) {
            this.facilityAttribute = new FacilityAttribute();
            this.facilityAttribute.facilityId = facility.id;
        } else {
            const rowJson = JSON.stringify(facilityAttribute);
            this.facilityAttribute = JSON.parse(rowJson);
        }
    }


    saveFacilityAttribute() {
        if (this.facilityAttribute == null || this.facilityAttribute.key == null || this.facilityAttribute.key === '') {
            this.messageService.add({
                severity: 'error',
                summary: 'İşlem Durumu',
                detail: 'Özellik başlık değerini giriniz!'
            });
            return;
        }

        this.manufacturerService.saveFacilityAttribute(this.facilityAttribute).subscribe(resp => {
            this.messageService.add({
                severity: 'success',
                summary: 'İşlem Durumu',
                detail: 'Kayıt başarıyla kaydedildi'
            });
            this.displayFacilityAttributePopup = false;
            this.getListByManufacturerId(this.item.id);

        }, (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'İşlem Durumu',
                detail: 'Hata: ' + error.error.error.message
            });
        });
    }


    deleteConfirmFacilityAttribute(event: Event, row: FacilityAttribute) {
        this.confirmationService.confirm({
            target: event.target,
            acceptLabel: 'Evet',
            rejectLabel: 'Hayır',
            message: row.key + ' adlı kadyı silmek istediğinizden emin misiniz?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteRowFacilityAttribute(row);
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

    deleteRowFacilityAttribute(row: FacilityAttribute) {

        const sb = this.manufacturerService.deleteRowFacilityAttribute(row.id).subscribe(resp => {
            this.getListByManufacturerId(this.item.id);
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
