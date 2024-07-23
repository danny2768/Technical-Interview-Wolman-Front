import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../shared/interfaces/user.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { environments } from '../../../environments/environment';
import { LoginRequest } from '../interfaces/login-req.interface';
import { RegisterRequest } from '../interfaces/register-req.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environments.baseUrl;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router,
  ) { }

  public register( user: User ): Observable<boolean | HttpErrorResponse> {
    return this.http.post<RegisterRequest>(`${this.baseUrl}/auth/register`, user).pipe(
      map( (resp) => true ),
      catchError( (err: HttpErrorResponse) => of(err))
    );
  }

  public loginUser( user: User ): Observable<LoginRequest | HttpErrorResponse> {
    return this.http.post<LoginRequest>(`${this.baseUrl}/auth/login`, user).pipe(
      map( (resp) => {
        this.cookieService.set('token', resp.token, {
          expires: 1,
          secure: true,
          sameSite: 'Strict',
          path: '/'
        });
        this.cookieService.set('role', resp.user.role.join(','), {
          expires: 1,
          secure: true,
          sameSite: 'Strict',
          path: '/'
        });
        this.router.navigate(['/']);
        return resp;
      }),
      catchError( (err: HttpErrorResponse) => of(err))
    );
  }

  public isAdminAuthenticated(): boolean {
    const token = this.cookieService.get('token');
    const roles = this.cookieService.get('role')?.split(',') || [];
    return token && (roles.includes('ADMIN_ROLE') || roles.includes('SUPER_ADMIN_ROLE')) ? true : false;
  }

  public isUserAuthenticated(): boolean {
    const token = this.cookieService.get('token');
    const roles = this.cookieService.get('role')?.split(',') || [];
    return token && roles.includes('USER_ROLE') ? true : false;
  }

  public logout(): void {
    this.cookieService.delete('token');
    this.cookieService.delete('role');
    this.router.navigate(['/']);
  }

}
