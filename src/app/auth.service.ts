
// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private isAdmin: boolean = false;
  private permissions: string[] = [];
  private loggedIn: boolean = false;
  private UserName!: string;

  constructor(private http: HttpClient,private router:Router) {
    this.checkAuthenticationToken();
    this.UserName = '';
  }

  private setPermissionsToStorage(permissions: string[]): void {
    localStorage.setItem('userPermissions', JSON.stringify(permissions));
  }

  private getPermissionsFromStorage(): string[] {
    const storedPermissions = localStorage.getItem('userPermissions');
    return storedPermissions ? JSON.parse(storedPermissions) : [];
  }

  private clearPermissionsFromStorage(): void {
    localStorage.removeItem('userPermissions');
  }

  private clearAuthenticationDetails(): void {
    this.clearPermissionsFromStorage();
    this.isAuthenticated = false;
    this.loggedIn = false;
    this.isAdmin = false;
    this.permissions = [];
  }

  private setAuthenticationDetails(token: string, isAdmin: boolean): void {
    localStorage.setItem('authToken', token);
    this.isAuthenticated = true;
    this.loggedIn = true;
    this.isAdmin = isAdmin;
    this.permissions = isAdmin ? ['user-master', 'other-permission'] : ['other-permission'];
  }


  // private baseUrl = 'http://localhost:3035/PrimeController/';
  private baseUrl = 'https://carbackend.primerides.in/PrimeController/';

  login(Email: string, Passwd: string): Observable<boolean> {
    return this.http.post<any>(`${this.baseUrl}loginUser`, { Email, Passwd }).pipe(
      map((user: any) => {
        if (user && user.token) {
          this.UserName = user.UserName; // Set the UserName in your service
          this.setAuthenticationDetails(user.token, Email === 'admin' && Passwd === 'admin@3301');
          this.setPermissionsToStorage(this.isAdmin ? ['user-master', 'other-permission'] : ['other-permission']);
          return true;
        } else {
          this.clearAuthenticationDetails();
          return false;
        }
      }),
      catchError((error) => {
        this.clearAuthenticationDetails();
        return of(false);
      })
    );
  }

  checkAuthenticationToken(): void {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
     
      this.setAuthenticationDetails(authToken, false); 
      
      this.permissions = this.getPermissionsFromStorage();
    } else {
      this.clearAuthenticationDetails();
    }
  }

  
  logout(): void {
    alert('User Successfully Logout');
    localStorage.removeItem('authToken');
    this.isAuthenticated = false;
    this.loggedIn = false;
    this.isAdmin = false;
    this.permissions = [];
    localStorage.setItem('loggedOut', 'true');
    this.router.navigate(['/']);
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  isAdminUser(): boolean {
    return this.isAdmin;
  }

  isUserLoggedIn(): boolean {
    return this.loggedIn;
  }

  getPermissions(): string[] {
    return this.permissions;
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }
  getUserName(): string {
        return this.UserName;
  }
}