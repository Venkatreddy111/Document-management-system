import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginData = { email: '', password: '' };
    showPassword = false;

    constructor(private authService: AuthService, private router: Router) { }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    login() {
        this.authService.login(this.loginData).subscribe({
            next: (res: any) => {
                if (!res.user.isProfileComplete) {
                    this.router.navigate(['/complete-profile']);
                } else {
                    this.router.navigate(['/documents']);
                }
            },
            error: (err) => {
                console.error(err);
                alert('Login failed');
            }
        });
    }
}
