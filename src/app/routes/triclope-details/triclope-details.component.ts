import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TriclopeService } from '../../shared/services/triclope.service';
import { Triclope } from '../../shared/models/triclope.interface';
import { TriclopeCardComponent } from '../../shared/components/triclope-card/triclope-card';

@Component({
  selector: 'app-triclope-details',
  imports: [CommonModule, TriclopeCardComponent],
  templateUrl: './triclope-details.component.html',
  styleUrl: './triclope-details.component.scss'
})
export class TriclopeDetailsComponent implements OnInit {
  triclope = signal<Triclope>({
    id: 'default',
    name: 'La Smala',
    creationDate: '2025-01-01T10:00:00'
  });
  loading = signal(false);
  error = signal<string | null>(null);

  // Menu state
  isMenuOpen = signal(false);

  // Mock data for the design
  personalCount = signal(25);
  totalCount = signal(120);

  participants = signal([
    {
      user: {
        id: '1',
        firstName: 'Genin',
        lastName: '',
        email: 'genin@example.com'
      },
      count: 25,
      backgroundColor: '#FDF7FF'
    },
    {
      user: {
        id: '2',
        firstName: 'Bodet',
        lastName: '',
        email: 'bodet@example.com'
      },
      count: 10,
      backgroundColor: '#FCF4E8'
    },
    {
      user: {
        id: '3',
        firstName: 'Alice',
        lastName: 'Dupont',
        email: 'alice@example.com'
      },
      count: 25,
      backgroundColor: '#F0FDFF'
    },
    {
      user: {
        id: '4',
        firstName: 'Bob',
        lastName: 'Martin',
        email: 'bob@example.com'
      },
      count: 10,
      backgroundColor: '#FCF0F0'
    }
  ]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private triclopeService: TriclopeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTriclope(id);
    }
  }

  private loadTriclope(id: string): void {
    this.loading.set(true);
    // For now, use mock data since getTriclopeById doesn't exist
    // TODO: Add getTriclopeById method to service
    this.triclope.set({
      id: id,
      name: 'La Smala',
      creationDate: '2025-01-01T10:00:00'
    });
    this.loading.set(false);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  navigateToMesDons(): void {
    this.closeMenu(); // Close the menu before navigating
    this.router.navigate(['/mes-dons']);
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  arrayBufferToBase64(buffer: number[]): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}