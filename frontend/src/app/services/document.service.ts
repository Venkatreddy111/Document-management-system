import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DocumentService {
    private API = 'http://localhost:5000/api/documents';

    constructor(private http: HttpClient) { }

    getHeaders() {
        return {
            headers: new HttpHeaders({
                Authorization: localStorage.getItem('token') || ''
            })
        };
    }

    upload(data: FormData) {
        return this.http.post(`${this.API}/upload`, data, this.getHeaders());
    }

    getDocuments() {
        return this.http.get<any[]>(this.API, this.getHeaders());
    }

    search(keyword: string) {
        return this.http.get<any[]>(`${this.API}/search?keyword=${keyword}`, this.getHeaders());
    }

    download(id: string) {
        return this.http.get(`${this.API}/download/${id}`, {
            ...this.getHeaders(),
            responseType: 'blob'
        });
    }

    deleteDocument(id: string) {
        return this.http.delete(`${this.API}/${id}`, this.getHeaders());
    }

    getFileUrl(path: string): string {
        // Construct the full URL for static file access
        // The backend serves 'uploads' folder at '/uploads'
        // filePath in DB is something like 'uploads\filename.ext'
        const normalizedPath = path.replace(/\\/g, '/');
        return `http://localhost:5000/${normalizedPath}`;
    }
}
