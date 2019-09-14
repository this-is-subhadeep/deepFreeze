import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { appConfigurations } from 'src/environments/conf';
import { Observable } from 'rxjs';
import { StandardResponse } from '../definitions/service-response-definition';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private uploadFileUrl=environment.serverBase+appConfigurations.fileURL;

  constructor(private http: HttpClient) { }

  uploadFile(file: File) : Observable<StandardResponse>{
    let url = this.uploadFileUrl + '/upload/'
    const fd = new FormData();
    fd.append('icon-image', file, file.name);
    return this.http.post<StandardResponse>(url, fd);
  }
}
