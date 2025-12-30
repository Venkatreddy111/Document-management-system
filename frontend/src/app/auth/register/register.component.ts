import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    registerData = { email: '', password: '' };
    showPassword = false;

    constructor(private authService: AuthService, private router: Router) { }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    register() {
        this.authService.register(this.registerData).subscribe({
            next: (res: any) => {
                alert('Account created! Please login to complete your profile.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                console.error(err);
                alert('Registration failed: ' + (err.error?.message || err.message));
            }
        });
    }
}
