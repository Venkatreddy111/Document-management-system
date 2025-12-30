import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-complete-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './complete-profile.component.html'
})
export class CompleteProfileComponent implements OnInit {
    userId: string = '';
    profile = {
        name: '',
        role: 'user',
        avatar: ''
    };
    loading = false;

    constructor(
        private profileService: ProfileService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            if (user) {
                this.userId = user.id;
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    saveProfile() {
        if (!this.profile.name) {
            alert('Please enter your name');
            return;
        }

        this.loading = true;
        this.profileService.updateProfile(this.userId, this.profile).subscribe({
            next: (res) => {
                // Update local user state
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                user.isProfileComplete = true;
                user.name = res.user.name;
                user.avatar = res.user.avatar;
                localStorage.setItem('user', JSON.stringify(user));

                alert('Profile completed successfully!');
                this.router.navigate(['/documents']);
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to complete profile:', err);
                alert('Error: ' + (err.error?.message || 'Something went wrong'));
                this.loading = false;
            }
        });
    }
}
