import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AppButtonComponent } from "../../shared/components/app-button/app-button.component";
import { TriclopeService, ParticipationService, AuthService } from "../../shared/services";
import { Triclope, Participation } from "../../shared/models";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [AppButtonComponent, CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  triclopes = signal<Triclope[]>([]);
  participations = signal<Participation[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private triclopeService: TriclopeService,
    private participationService: ParticipationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadTriclopes();
      this.loadParticipations();
    }
  }

  private loadTriclopes(): void {
    this.loading.set(true);
    this.triclopeService.getAllTriclopes().subscribe({
      next: (triclopes) => {
        this.triclopes.set(triclopes);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Erreur lors du chargement des triclopes');
        this.loading.set(false);
        console.error('Error loading triclopes:', error);
      }
    });
  }

  private loadParticipations(): void {
    this.participationService.getAllParticipations().subscribe({
      next: (participations) => {
        this.participations.set(participations);
      },
      error: (error) => {
        console.error('Error loading participations:', error);
      }
    });
  }

  onCreateTriclope(): void {
    const newTriclope = {
      name: 'Nouveau Triclope',
      createdBy: this.authService.getCurrentUserId() || '550e8400-e29b-41d4-a716-446655440001'
    };

    this.triclopeService.createTriclope(newTriclope).subscribe({
      next: (triclope) => {
        this.triclopes.update(current => [...current, triclope]);
      },
      error: (error) => {
        this.error.set('Erreur lors de la création du triclope');
        console.error('Error creating triclope:', error);
      }
    });
  }
}