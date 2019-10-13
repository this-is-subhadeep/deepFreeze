import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { appConfigurations } from 'src/environments/conf';
import { Observable } from 'rxjs';
import { StandardResponse } from '../definitions/service-response-definition';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private uploadFileUrl = environment.serverBase + appConfigurations.fileURL;

  constructor(private http: HttpClient, private userService: UserService) { }

  uploadFile(file: File): Observable<StandardResponse> {
    const url = this.uploadFileUrl + '/upload/';
    const fd = new FormData();
    fd.append('icon-image', file, file.name);
    return this.http.post<StandardResponse>(url, fd, {
      headers : new HttpHeaders().set('Authorization', `Bearer ${this.userService.bearerToken}`)
    });
  }
}
