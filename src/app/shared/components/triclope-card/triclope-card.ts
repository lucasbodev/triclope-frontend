import { Component, input, signal, HostBinding, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Triclope, Participation } from '../../models';

@Component({
  selector: 'app-triclope-card',
  imports: [CommonModule],
  templateUrl: './triclope-card.html',
  styleUrl: './triclope-card.scss'
})
export class TriclopeCardComponent {
  triclope = input.required<Triclope>();
  participations = input<Participation[]>([]);
  participants = input<{user: any, count: number, backgroundColor?: string}[]>([]);
  displayMode = input<'participations' | 'participants'>('participations');
  isExpanded = signal(false);

  deleteParticipationEvent = output<string>();

  // Color variation inputs
  backgroundColor = input<string>('#fdf7ff');
  textColor = input<string>('#333');
  borderColor = input<string>('#e6b3ff');
  avatarColor = input<string>('linear-gradient(135deg, #ff9f43, #ff6b35)');

  // Content variation inputs
  showParticipantName = input<boolean>(true);
  participantName = input<string>('Genin');
  participantCount = input<number>(25);

  // Set CSS custom properties dynamically
  @HostBinding('style')
  get hostStyles() {
    return {
      '--card-background-color': this.backgroundColor(),
      '--card-text-color': this.textColor(),
      '--card-border-color': this.borderColor()
    };
  }

  constructor(private router: Router) {}

  toggleExpansion(): void {
    this.isExpanded.set(!this.isExpanded());
  }

  navigateToDetails(): void {
    this.router.navigate(['/triclope', this.triclope().id]);
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  deleteParticipation(participationId: string): void {
    this.deleteParticipationEvent.emit(participationId);
  }
}
