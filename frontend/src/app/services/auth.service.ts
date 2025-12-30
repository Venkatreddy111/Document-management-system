import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private API = 'http://localhost:5000/api/auth';
    private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) { }

    private getUserFromStorage() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (!token || !user) return null;
        return JSON.parse(user);
    }

    register(data: any) {
        return this.http.post(`${this.API}/register`, data);
    }

    login(data: any) {
        return this.http.post<any>(`${this.API}/login`, data).pipe(
            tap(res => {
                this.saveToken(res.token);
                localStorage.setItem('role', res.user.role);
                localStorage.setItem('user', JSON.stringify(res.user));
                this.userSubject.next(res.user);
            })
        );
    }

    saveToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    logout() {
        localStorage.clear();
        this.userSubject.next(null);
    }
}
