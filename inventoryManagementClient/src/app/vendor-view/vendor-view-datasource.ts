import { Vendor } from "../definitions/vendor-definition";
import { BehaviorSubject } from "rxjs";
import { VendorService } from "../services/vendor.service";

export class VendorDataSource {
    private vendors$ = new BehaviorSubject<Vendor[]>(new Array<Vendor>());
    private fetchComplete$ = new BehaviorSubject<boolean>(false);
    constructor(private service: VendorService) { }

    get vendorsObservable() {
        return this.vendors$.asObservable();
    }

    get fetchComplete() {
        return this.fetchComplete$.asObservable();
    }

    loadVendors(refDate: string) {
        this.fetchComplete$.next(false);
        this.service.getAllVendors(refDate);
        this.service.vendorObservable.subscribe(vendors => {
            this.vendors$.next(vendors);
        }, error => { }, () => {
            this.fetchComplete$.next(true);
        });
    }
}