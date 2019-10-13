import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { appConfigurations } from 'src/environments/conf';
import { environment } from 'src/environments/environment';
import { LoginUserRequest, LoginUserResponse } from '../definitions/user-definition';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private localToken = 'bearer';

  private userUrl = environment.serverBase + appConfigurations.userURL;

  constructor(private http: HttpClient) { }

  userLogin(user: LoginUserRequest) {
    const url = this.userUrl + '/login';
    return this.http.post<LoginUserResponse>(url, user);
  }

  isUserAuthenticated(token): Observable<boolean> {
    const url = this.userUrl + '/authenticate';
    return this.http.post<{ isUserAuthenticated: boolean }>(url, {}, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }).pipe(map(res => res.isUserAuthenticated));
  }

  set bearerToken(token) {
    localStorage.setItem(this.localToken, token);
  }

  get bearerToken() {
    return localStorage.getItem(this.localToken);
  }

  get authHeader(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearerToken}`)
    }
  }
}
