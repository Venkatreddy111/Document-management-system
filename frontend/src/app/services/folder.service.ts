import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FolderService {
    private API = 'http://localhost:5000/api/folders';
    private folderChanged = new Subject<void>();
    folderChanged$ = this.folderChanged.asObservable();

    constructor(private http: HttpClient) { }

    private getHeaders() {
        return {
            headers: new HttpHeaders({
                Authorization: localStorage.getItem('token') || ''
            })
        };
    }

    notifyFolderChanged() {
        this.folderChanged.next();
    }

    createFolder(name: string, parent: string | null): Observable<any> {
        return this.http.post(this.API, { name, parent }, this.getHeaders());
    }

    getFolderContents(id: string): Observable<any> {
        return this.http.get(`${this.API}/${id}`, this.getHeaders());
    }

    getBreadcrumbs(id: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/breadcrumbs/${id}`, this.getHeaders());
    }

    getFolderTree(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/tree`, this.getHeaders());
    }

    deleteFolder(id: string): Observable<any> {
        return this.http.delete(`${this.API}/${id}`, this.getHeaders());
    }
}
