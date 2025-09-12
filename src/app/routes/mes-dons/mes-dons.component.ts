import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface DonationUser {
  id: string;
  name: string;
  avatar: string;
  cigarettesCount: number;
  backgroundColor: string;
}

@Component({
  selector: 'app-mes-dons',
  imports: [CommonModule, RouterModule],
  templateUrl: './mes-dons.component.html',
  styleUrl: './mes-dons.component.scss'
})
export class MesDonsComponent {
  weeklyCount = 25;
  monthlyCount = 120;
  totalDonations = 145;

  donationUsers: DonationUser[] = [
    {
      id: '1',
      name: 'Genin',
      avatar: 'assets/images/avatar1.jpg',
      cigarettesCount: 25,
      backgroundColor: '#fdf7ff'
    },
    {
      id: '2',
      name: 'Bodet',
      avatar: 'assets/images/avatar2.jpg',
      cigarettesCount: 10,
      backgroundColor: '#fefefe'
    },
    {
      id: '3',
      name: 'Genin',
      avatar: 'assets/images/avatar3.jpg',
      cigarettesCount: 25,
      backgroundColor: '#f0f9ff'
    },
    {
      id: '4',
      name: 'Bodet',
      avatar: 'assets/images/avatar4.jpg',
      cigarettesCount: 10,
      backgroundColor: '#fefefe'
    }
  ];

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/home']);
  }

  addScratching(): void {
    // TODO: Implement add scratching functionality
    console.log('Add scratching');
  }

  viewUserDonations(userId: string): void {
    // TODO: Navigate to user donations detail
    console.log('View user donations:', userId);
  }
}