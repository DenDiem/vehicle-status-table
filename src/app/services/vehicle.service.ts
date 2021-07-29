import { Injectable } from '@angular/core';
import { 
  Observable,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { VehicleCode } from '../shared/interface';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private readonly vehicleDataUrl = 'assets/data.json'
   
  constructor(private http: HttpClient) { }

  public getVehicles (): Observable<VehicleCode[]> {
    return this.http.get<VehicleCode[]>(this.vehicleDataUrl);
  }

}
