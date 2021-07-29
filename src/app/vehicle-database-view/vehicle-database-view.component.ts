import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {
  VehicleTableFilter,
  VehicleTableColumnName,
  vehicleTableColumnNameMap,
  vehicleTableDisplayedColumns,
  VehicleTableLists,
} from './vehicle-database-view.type';
import { VehicleCode } from '../shared/interface';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-database-view',
  templateUrl: './vehicle-database-view.component.html',
  styleUrls: ['./vehicle-database-view.component.scss']
})
export class VehicleDatabaseViewComponent implements OnInit, AfterViewInit, OnDestroy {

  public readonly VehicleTableColumnName: typeof VehicleTableColumnName = VehicleTableColumnName;
  public filterForm: FormGroup = this.buildForm();
  public dataSource: MatTableDataSource<VehicleCode>;
  public displayedColumns: string[] = vehicleTableDisplayedColumns;
  public vehicleTableLists: VehicleTableLists;

  private destroySubject: Subject<void> = new Subject();
  private destroy$: Observable<void> = this.destroySubject.asObservable();

  @ViewChild(MatPaginator)
  private paginator: MatPaginator;
  @ViewChild(MatSort)
  private sort: MatSort;

  constructor(
    private vehicleService: VehicleService,
    private fb: FormBuilder,
  ) {}

  public ngOnInit(): void {
    this.dataSource = this.getDataSource();
    this.vehicleTableLists = { contragent: [], department: [], organization: [] };
    this.vehicleService.getVehicles()
      .subscribe((vehicles: VehicleCode[]) => {
        this.dataSource.data = vehicles;
        this.vehicleTableLists = this.getUniqueValue();
      });
    this.filterForm.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe((filter: VehicleTableFilter) => {
      this.dataSource.filter = JSON.stringify(filter);
    });
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  private buildForm(): FormGroup {
    const controls: Record<keyof VehicleTableFilter, unknown> = {
      global: '',
      organization: '',
      department: '',
      contragent: '',
    };
    return this.fb.group(controls);
  }

  private doFilter(filter: string, value: string): boolean {
    if (filter) {
      if (!value) {
        return false;
      } else {
        return value.trim().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      }
    } else {
      return true;
    }
  }

  private customFilterPredicate() {
    const myFilterPredicate = (data: VehicleCode, filter: string): boolean => {
      const {
        global,
        organization,
        department,
        contragent,
      }: VehicleTableFilter = JSON.parse(filter);

      const checkAllColonum =
          data.Vehicle.name +
          data.Vehicle.Organization?.name +
          data.Vehicle.Department?.name +
          data.Vehicle.Contragent?.name +
          data?.code1c +
          data.Aggregate?.name +
          data.Drivers?.toString().replace(',', ' ');
      const globalMatch = this.doFilter(global, checkAllColonum);
      if (!globalMatch) {
        return false;
      }

      const organizationMatch: boolean =
        this.doFilter(organization, data.Vehicle.Organization?.name);
      const departmentMatch: boolean =
        this.doFilter(department, data.Vehicle.Department?.name);
      const contragentMatch: boolean =
        this.doFilter(contragent, data.Vehicle.Contragent?.name);
      return organizationMatch && departmentMatch && contragentMatch;
    }
    return myFilterPredicate;
  }

  private getUniqueValue(): VehicleTableLists {
    const organization: Set<string> = new Set();
    const department: Set<string> = new Set();
    const contragent: Set<string> = new Set();
    this.dataSource.data.forEach((element) => {
      if (!!element.Vehicle.Organization?.name) {
        organization.add(element.Vehicle.Organization.name);
      }
      if (!!element.Vehicle.Department?.name) {
        department.add(element.Vehicle.Department.name);
      }
      if (!!element.Vehicle.Contragent?.name) {
        contragent.add(element.Vehicle.Contragent.name);
      }
    });
    return {
      organization: [...organization],
      department: [...department],
      contragent: [...contragent],
    };
  }

  private getDataSource(): MatTableDataSource<VehicleCode> {
    const dataSource: MatTableDataSource<VehicleCode> = new MatTableDataSource([]);
    dataSource.sortingDataAccessor = (item: VehicleCode, property) => {
      switch (property) {
        case VehicleTableColumnName.Vehicle:
          return item.Vehicle?.name;
        case VehicleTableColumnName.Organization:
          return item.Vehicle?.Organization?.name;
        case VehicleTableColumnName.Department:
          return item.Vehicle?.Department?.name;
        case VehicleTableColumnName.Contragent:
          return item.Vehicle.Contragent?.name;
        case VehicleTableColumnName.Aggregate:
          return item.Aggregate?.name;
        default:
          return item[vehicleTableColumnNameMap[property]];
      }
    };
    return dataSource;
  }
}
