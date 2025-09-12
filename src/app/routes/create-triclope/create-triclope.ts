import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TriclopeService, AuthService } from '../../shared/services';

@Component({
  selector: 'app-create-triclope',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-triclope.html',
  styleUrl: './create-triclope.scss'
})
export class CreateTriclope {
  triclopeName = signal('');
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isDragOver = signal(false);

  constructor(
    private router: Router,
    private triclopeService: TriclopeService,
    private authService: AuthService
  ) {}

  onClose(): void {
    this.router.navigate(['/']);
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  async onCreate(): Promise<void> {
    if (!this.triclopeName().trim()) {
      return;
    }

    let logoBytes: number[] | null = null;
    if (this.selectedFile) {
      logoBytes = Array.from(new Uint8Array(await this.selectedFile.arrayBuffer()));
    }

    const newTriclope = {
      name: this.triclopeName().trim(),
      logo: logoBytes,
      createdBy: this.authService.getCurrentUserId() || '550e8400-e29b-41d4-a716-446655440001'
    };

    this.triclopeService.createTriclope(newTriclope).subscribe({
      next: (triclope) => {
        // Navigate back to home after successful creation
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error creating triclope:', error);
        // TODO: Show error message to user
      }
    });
  }

  onFileClick(): void {
    const fileInput = document.querySelector('.file-input') as HTMLInputElement;
    fileInput?.click();
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format de fichier non supporté. Utilisez PNG, JPG, JPEG ou WebP.');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('Le fichier est trop volumineux. Taille maximum: 5MB.');
        return;
      }

      this.selectedFile = file;

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
