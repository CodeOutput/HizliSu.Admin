import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {appModuleAnimation} from '../../shared/animations/routerTransition';
import {Subscription} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {toNumber} from 'lodash-es';
import {DomSanitizer} from '@angular/platform-browser';
import {CityService} from '../../shared/services/city.service';
import {City} from '../../shared/models/city.model';
import {District} from '../../shared/models/district.model';
import {DistrictService} from '../../shared/services/district.service';
import {Facility} from '../../shared/models/facility.model';
import {Neighborhood} from '../../shared/models/neighborhood.model';
import {NeighborhoodService} from '../../shared/services/neighborhood.service';


@Component({
    templateUrl: './cities-detail.component.html',
    animations: [appModuleAnimation()],
    providers: [CityService, DistrictService, NeighborhoodService]
})
export class CitiesDetailComponent implements OnInit, OnDestroy {
    item: City = new City();
    districtCo: District = new District();
    list: District[] = [];
    district: District  = new District();
    neighborhood: Neighborhood  = new Neighborhood();
    cityId: number;
    public imagePath: any;
    subscriptions: Subscription[] = [];
    activeIndex = 0;
    displayPopup = false;
    displayNeighborhoodPopup = false;

    constructor(
        private cityService: CityService,
        private districtService: DistrictService,
        private neighborhoodService: NeighborhoodService,
        private confirmationService: ConfirmationService,
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
            this.cityId = toNumber(params.get('cityId'));
            if (params.get('cityId').toLowerCase() !== 'add') {
                this.getItemById(this.cityId);
                this.getDistrictList();
            }
        }));
    }

    getItemById(id: number) {
        const sb = this.cityService.getItemById(id).subscribe(resp => {
            console.log('cityService getItemById ---->>', resp.result);
            this.item = resp.result;
            this.cdr.detectChanges();
        }, (error) => {
            // this.loading = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Veri çekme işlemi',
                detail: 'Kayıtlar alınamadı! Hata: ' + error.error.error.message
            });
        });
        this.subscriptions.push(sb);
    }

    getDistrictList() {
        this.districtCo.cityId = this.cityId;
        const sb = this.districtService.getList(this.districtCo).subscribe(resp => {
            console.log('districtService getList ---->>', resp.result);
            this.list = resp.result.items;
            this.cdr.detectChanges();
        }, (error) => {
            // this.loading = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Veri çekme işlemi',
                detail: 'Kayıtlar alınamadı! Hata: ' + error.error.error.message
            });
        });
        this.subscriptions.push(sb);
    }


    saveRow() {
        if (this.item == null || this.item.name == null) {
            this.messageService.add({
                severity: 'error',
                summary: 'İşlem Durumu',
                detail: 'Şehir adı giriniz!'
            });
            return;
        }

        this.cityService.saveRow(this.item).subscribe(resp => {
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


    saveDistrict() {
        this.district.cityId = this.cityId;
        this.districtService.saveRow(this.district).subscribe(resp => {
            this.messageService.add({
                severity: 'success',
                summary: 'İşlem Durumu',
                detail: 'Kayıt başarıyla kaydedildi'
            });
            this.displayPopup = false;
            this.getDistrictList();

        }, (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'İşlem Durumu',
                detail: 'Hata: ' + error.error.error.message
            });
        });
    }

    addOrUpdateDistrict(item: District) {
        this.displayPopup = true;
        if (item == null) {
            this.district = new District();
        } else {
            const row = JSON.stringify(item);
            this.district = JSON.parse(row);
        }
    }


    deleteConfirm(event: Event, row: District) {
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

    deleteRow(row: District) {

        const sb = this.districtService.deleteRow(row.id).subscribe(resp => {
            this.getDistrictList();
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
    addOrUpdateNeighborhood(district: District, neighborhood: Neighborhood) {
        this.displayNeighborhoodPopup = true;
        if (neighborhood == null) {
            this.neighborhood = new Neighborhood();
            this.neighborhood.districtId = district.id;
        } else {
            const rowJson = JSON.stringify(neighborhood);
            this.neighborhood = JSON.parse(rowJson);
        }
    }


    saveNeighborhood() {
        if (this.neighborhood == null || this.neighborhood.name == null || this.neighborhood.name === '') {
            this.messageService.add({
                severity: 'error',
                summary: 'İşlem Durumu',
                detail: 'Mahalle adını giriniz!'
            });
            return;
        }

        this.neighborhoodService.saveRow(this.neighborhood).subscribe(resp => {
            this.messageService.add({
                severity: 'success',
                summary: 'İşlem Durumu',
                detail: 'Kayıt başarıyla kaydedildi'
            });
            this.displayNeighborhoodPopup = false;
            this.getDistrictList();

        }, (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'İşlem Durumu',
                detail: 'Hata: ' + error.error.error.message
            });
        });
    }


    deleteConfirmNeighborhood(event: Event, row: Neighborhood) {
        this.confirmationService.confirm({
            target: event.target,
            acceptLabel: 'Evet',
            rejectLabel: 'Hayır',
            message: row.name + ' adlı kadyı silmek istediğinizden emin misiniz?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteRowNeighborhood(row);
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

    deleteRowNeighborhood(row: Neighborhood) {

        const sb = this.neighborhoodService.deleteRow(row.id).subscribe(resp => {
            this.getDistrictList();
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
