import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private API = 'http://localhost:5000/api/users';

    constructor(private http: HttpClient) { }

    getHeaders() {
        return {
            headers: new HttpHeaders({
                Authorization: localStorage.getItem('token') || ''
            })
        };
    }

    // Load user profile data
    // We intentionally don't cache this too aggressively because storage stats change often
    loadUserProfile(userId: string) {
        return this.http.get<any>(`${this.API}/profile/${userId}`, this.getHeaders());
    }

    updateProfile(userId: string, data: any) {
        return this.http.put<any>(`${this.API}/profile/${userId}`, data, this.getHeaders());
    }
}
