import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { AuthService } from '../../services/auth.service';
import { FolderService } from '../../services/folder.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './list.component.html',
    styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
    documents: any[] = [];
    keyword = '';
    userRole = '';
    selectedDoc: any = null;
    safeUrl: SafeResourceUrl | null = null;
    folders: any[] = [];
    breadcrumbs: any[] = [];
    currentFolderId: string = 'root';
    newFolderName: string = '';
    showCreateFolderModal: boolean = false;

    // Delete confirmation state
    showDeleteModal = false;
    itemToDelete: { id: string, name: string, type: 'folder' | 'document' } | null = null;

    constructor(
        private documentService: DocumentService,
        private authService: AuthService,
        private folderService: FolderService,
        private router: Router,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.userRole = localStorage.getItem('role') || '';
        this.route.params.subscribe(params => {
            this.currentFolderId = params['id'] || 'root';
            this.fetchFolderContents();
            this.fetchBreadcrumbs();
        });
    }

    fetchFolderContents() {
        this.folderService.getFolderContents(this.currentFolderId).subscribe(res => {
            this.folders = res.folders;
            this.documents = res.documents;
        });
    }

    fetchBreadcrumbs() {
        if (this.currentFolderId === 'root') {
            this.breadcrumbs = [];
            return;
        }
        this.folderService.getBreadcrumbs(this.currentFolderId).subscribe(res => {
            this.breadcrumbs = res;
        });
    }

    createFolder() {
        if (!this.newFolderName.trim()) return;
        const parentId = this.currentFolderId === 'root' ? null : this.currentFolderId;
        this.folderService.createFolder(this.newFolderName, parentId).subscribe(() => {
            this.newFolderName = '';
            this.showCreateFolderModal = false;
            this.fetchFolderContents();
            this.folderService.notifyFolderChanged();
        });
    }

    navigateToFolder(id: string) {
        this.router.navigate(['/documents/folders', id]);
    }

    // DELETE LOGIC
    confirmDelete(item: any, type: 'folder' | 'document') {
        this.itemToDelete = {
            id: item._id,
            name: type === 'folder' ? item.name : item.title,
            type: type
        };
        this.showDeleteModal = true;
    }

    executeDelete() {
        if (!this.itemToDelete) return;

        if (this.itemToDelete.type === 'folder') {
            this.folderService.deleteFolder(this.itemToDelete.id).subscribe(() => {
                this.fetchFolderContents();
                this.folderService.notifyFolderChanged();
                this.closeDeleteModal();
                alert('Folder deleted');
            });
        } else {
            this.documentService.deleteDocument(this.itemToDelete.id).subscribe(() => {
                this.fetchFolderContents();
                this.closeDeleteModal();
                alert('Document deleted');
            });
        }
    }

    closeDeleteModal() {
        this.showDeleteModal = false;
        this.itemToDelete = null;
    }

    search() {
        if (this.keyword) {
            this.documentService.search(this.keyword).subscribe(res => {
                this.documents = res;
                this.folders = []; // Hide folders during global search or we could filter them
            });
        } else {
            this.fetchFolderContents();
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    download(doc: any) {
        this.documentService.download(doc._id).subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = doc.title || 'document';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Download failed:', err);
                alert('Failed to download document');
            }
        });
    }

    viewDocument(doc: any) {
        this.selectedDoc = doc;
        const url = this.documentService.getFileUrl(doc.filePath);
        if (doc.fileType === 'application/pdf') {
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        } else {
            this.safeUrl = url;
        }
    }

    closePreview() {
        this.selectedDoc = null;
        this.safeUrl = null;
    }

    isImage(fileType: string): boolean {
        return fileType.startsWith('image/');
    }

    isPDF(fileType: string): boolean {
        return fileType === 'application/pdf';
    }
}
