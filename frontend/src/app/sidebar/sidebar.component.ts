import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FolderService } from '../services/folder.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    folders: any[] = [];
    isLoggedIn = false;

    constructor(
        private folderService: FolderService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            this.isLoggedIn = !!user && user.isProfileComplete;
            if (this.isLoggedIn) {
                this.loadFolderTree();
            } else {
                this.folders = [];
            }
        });

        this.folderService.folderChanged$.subscribe(() => {
            if (this.isLoggedIn) {
                this.loadFolderTree();
            }
        });
    }

    loadFolderTree() {
        this.folderService.getFolderTree().subscribe(tree => {
            this.folders = tree;
        });
    }

    toggleFolder(folder: any, event: Event) {
        event.stopPropagation();
        folder.isExpanded = !folder.isExpanded;
    }
}
