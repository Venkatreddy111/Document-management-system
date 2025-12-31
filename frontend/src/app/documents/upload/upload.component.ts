import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { FolderService } from '../../services/folder.service';

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit {
    title = '';
    tags = '';
    file: File | null = null;
    folderId: string = '';
    message: string = ''; // Used for user feedback

    constructor(
        private documentService: DocumentService,
        private folderService: FolderService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        // Optionally get folderId from query params if coming from a specific folder
        this.route.queryParams.subscribe(params => {
            if (params['folderId']) {
                this.folderId = params['folderId'];
            }
        });
    }

    onFileSelect(event: any) {
        this.file = event.target.files[0];
    }

    submitUploadForm() {
        if (!this.file || !this.title) {
            alert('Please select file and title');
            return;
        }

        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('title', this.title);
        formData.append('tags', this.tags);
        if (this.folderId) {
            formData.append('folderId', this.folderId);
        }

        // Send the file to the backend
        // We subscribe here to handle success/error and update the UI accordingly
        this.documentService.processNewFileUpload(formData).subscribe({
            next: (event: any) => {
                // Success! Give the user some feedback
                this.message = 'File uploaded successfully! redirecting...';
                this.router.navigate(['/documents']);
            },
            error: (err) => {
                console.error(err);
                alert('Upload failed');
            }
        });
    }
}
