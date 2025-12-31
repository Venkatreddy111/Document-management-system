import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
    user: any = { id: '', name: '', email: '', role: '', avatar: '', totalFiles: 0, totalStorage: 0 };
    profileData = { name: '', email: '', avatar: '', currentPassword: '', newPassword: '', confirmPassword: '' };
    showCurrentPassword = false;
    showNewPassword = false;
    showConfirmPassword = false;
    isEditing = false;
    loading = false;
    error: string | null = null;

    constructor(
        private profileService: ProfileService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        // Initial load via Auth Service (usually handles page refresh)
        this.authService.user$.subscribe(user => {
            if (user) {
                this.user.id = user.id;
                this.loadProfile();
            }
        });

        // Trigger load on Navigation (handles client-side routing)
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            // Re-check auth or just reload if we have a user ID
            if (this.user.id) {
                this.loadProfile();
            }
        });
    }

    loadProfile() {
        if (!this.user.id) {
            this.loading = false;
            this.error = 'No user ID found. Please log in again.';
            return;
        }

        this.loading = true;
        this.error = null;
        // Fetch the latest profile data to ensure stats are accurate
        this.profileService.loadUserProfile(this.user.id).subscribe({
            next: (data) => {
                this.user = { ...this.user, ...data };
                this.profileData.name = data.name;
                this.profileData.email = data.email;
                this.profileData.avatar = data.avatar || '';
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load profile:', err);
                this.error = 'Failed to sync details. Please check your connection.';
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            this.profileData.name = this.user.name;
            this.profileData.email = this.user.email;
            this.profileData.avatar = this.user.avatar || '';
            this.profileData.currentPassword = '';
            this.profileData.newPassword = '';
            this.profileData.confirmPassword = '';
        }
    }

    togglePasswordVisibility(field: string) {
        if (field === 'current') this.showCurrentPassword = !this.showCurrentPassword;
        if (field === 'new') this.showNewPassword = !this.showNewPassword;
        if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
    }

    updateProfile() {
        if (this.profileData.newPassword && this.profileData.newPassword !== this.profileData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        this.loading = true;
        const updateData: any = {
            name: this.profileData.name,
            email: this.profileData.email,
            avatar: this.profileData.avatar
        };

        if (this.profileData.newPassword) {
            updateData.currentPassword = this.profileData.currentPassword;
            updateData.newPassword = this.profileData.newPassword;
        }

        this.profileService.updateProfile(this.user.id, updateData).subscribe({
            next: (res) => {
                alert('Profile updated successfully');
                this.user = { ...this.user, ...res.user };
                this.isEditing = false;
                this.profileData.currentPassword = '';
                this.profileData.newPassword = '';
                this.profileData.confirmPassword = '';
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to update profile:', err);
                alert(err.error?.error || 'Failed to update profile');
                this.loading = false;
            }
        });
    }

    formatSize(bytes: number): string {
        if (!bytes) return '0 MB';
        const mb = bytes / (1024 * 1024);
        return mb < 1024
            ? `${mb.toFixed(2)} MB`
            : `${(mb / 1024).toFixed(2)} GB`;
    }
}
