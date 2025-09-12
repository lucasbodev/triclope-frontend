import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { TriclopeService, ParticipationService, AuthService } from "../../shared/services";
import { Triclope, Participation } from "../../shared/models";
import { TriclopeCardComponent } from "../../shared/components/triclope-card/triclope-card";

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, TriclopeCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  triclopes = signal<Triclope[]>([]);
  participations = signal<Participation[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  userName = signal<string>('Colbi'); // Default, will be updated
  animatedCount = signal<number>(0);
  targetCount = 25; // Valeur cible du compteur
  digitAnimations = signal<{digit: number, isAnimating: boolean, delay: number}[]>([]);

  // Progress bar data
  cigarettesGiven = signal<number>(35); // Mock data: cigarettes given this week
  cigarettesReceived = signal<number>(15); // Mock data: cigarettes received this week
  progressRatio = signal<number>(0); // Calculated ratio (-100 to 100)
  progressFillWidth = signal<number>(50); // Percentage width of progress fill
  progressFillLeft = signal<number>(25); // Left position percentage

  // Color schemes for triclope cards
  cardVariations = [
    {
      backgroundColor: '#fdf7ff',
      textColor: '#333',
      borderColor: '#e6b3ff',
      avatarColor: 'linear-gradient(135deg, #ff9f43, #ff6b35)',
      participantName: 'Genin',
      participantCount: 25
    },
    {
      backgroundColor: '#FCF4E8',
      textColor: '#8B4513',
      borderColor: '#D2691E',
      avatarColor: 'linear-gradient(135deg, #FFD700, #FFA500)',
      participantName: 'Alice',
      participantCount: 42
    },
    {
      backgroundColor: '#F0FDFF',
      textColor: '#006994',
      borderColor: '#00A8E8',
      avatarColor: 'linear-gradient(135deg, #006994, #0080FF)',
      participantName: 'Bob',
      participantCount: 18
    },
    {
      backgroundColor: '#FCF0F0',
      textColor: '#8B0000',
      borderColor: '#DC143C',
      avatarColor: 'linear-gradient(135deg, #8B0000, #B22222)',
      participantName: 'Charlie',
      participantCount: 67
    },
    {
      backgroundColor: '#F0FFF0',
      textColor: '#006400',
      borderColor: '#32CD32',
      avatarColor: 'linear-gradient(135deg, #006400, #228B22)',
      participantName: 'Diana',
      participantCount: 33
    }
  ];

  constructor(
    private triclopeService: TriclopeService,
    private participationService: ParticipationService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Always set fake triclopes for demo
    this.triclopes.set([
      {
        id: '550e8400-e29b-41d4-a716-446655440101',
        name: 'Triclope des Amis',
        creationDate: '2025-01-01T10:00:00'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440102',
        name: 'Triclope du Bureau',
        creationDate: '2025-01-02T11:00:00'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440103',
        name: 'Triclope Familial',
        creationDate: '2025-01-03T12:00:00'
      }
    ]);

    // Set fake participations for demo
    this.participations.set([
      {
        id: 'part1',
        quantity: 1,
        createdAt: '2025-09-04T23:00:00',
        triclopeId: '550e8400-e29b-41d4-a716-446655440101',
        giver: { id: 'user1', firstName: 'Alice', lastName: 'Dupont', email: 'alice@example.com' },
        taker: { id: 'user2', firstName: 'Bob', lastName: 'Martin', email: 'bob@example.com' }
      },
      {
        id: 'part2',
        quantity: 1,
        createdAt: '2025-09-04T22:30:00',
        triclopeId: '550e8400-e29b-41d4-a716-446655440101',
        giver: { id: 'user1', firstName: 'Alice', lastName: 'Dupont', email: 'alice@example.com' },
        taker: { id: 'user2', firstName: 'Bob', lastName: 'Martin', email: 'bob@example.com' }
      },
      {
        id: 'part3',
        quantity: 2,
        createdAt: '2025-09-04T21:30:00',
        triclopeId: '550e8400-e29b-41d4-a716-446655440101',
        giver: { id: 'user1', firstName: 'Alice', lastName: 'Dupont', email: 'alice@example.com' },
        taker: { id: 'user2', firstName: 'Bob', lastName: 'Martin', email: 'bob@example.com' }
      },
      {
        id: 'part4',
        quantity: 1,
        createdAt: '2025-09-04T21:00:00',
        triclopeId: '550e8400-e29b-41d4-a716-446655440101',
        giver: { id: 'user1', firstName: 'Alice', lastName: 'Dupont', email: 'alice@example.com' },
        taker: { id: 'user2', firstName: 'Bob', lastName: 'Martin', email: 'bob@example.com' }
      }
    ]);

    if (this.authService.isLoggedIn()) {
      this.loadTriclopes();
      this.loadParticipations();
      this.userName.set(this.authService.getUsername() || 'Utilisateur');
    } else {
      this.userName.set('Visiteur');
    }

    // Démarrer l'animation du compteur après un petit délai
    setTimeout(() => {
      this.animateCounter();
    }, 500);

    // Calculate initial progress ratio
    this.calculateProgressRatio();
  }

  private loadTriclopes(): void {
    this.loading.set(true);
    this.triclopeService.getAllTriclopes().subscribe({
      next: (triclopes) => {
        // Combine loaded triclopes with fake ones
        const fakeTriclopes = [
          {
            id: '550e8400-e29b-41d4-a716-446655440101',
            name: 'Triclope des Amis',
            creationDate: '2025-01-01T10:00:00'
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440102',
            name: 'Triclope du Bureau',
            creationDate: '2025-01-02T11:00:00'
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440103',
            name: 'Triclope Familial',
            creationDate: '2025-01-03T12:00:00'
          }
        ];
        this.triclopes.set([...triclopes, ...fakeTriclopes]);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Erreur lors du chargement des triclopes');
        this.loading.set(false);
        console.error('Error loading triclopes:', error);
        // Set fake triclopes on error
        this.triclopes.set([
          {
            id: '550e8400-e29b-41d4-a716-446655440101',
            name: 'Triclope des Amis',
            creationDate: '2025-01-01T10:00:00'
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440102',
            name: 'Triclope du Bureau',
            creationDate: '2025-01-02T11:00:00'
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440103',
            name: 'Triclope Familial',
            creationDate: '2025-01-03T12:00:00'
          }
        ]);
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
    this.router.navigate(['/create-triclope']);
  }

  onDeleteParticipation(participationId: string): void {
    // TODO: Implement deletion logic
    console.log('Delete participation:', participationId);
  }

  toggleNotifications(): void {
    // TODO: Implement notification panel toggle
    console.log('Toggle notifications');
  }

  getUserInitial(): string {
    const userName = this.userName().trim();
    return userName.charAt(0).toUpperCase() || 'U';
  }

  animateCounter(): void {
    const duration = 3000; // Durée totale de l'animation en ms
    const startValue = 0;
    const startTime = Date.now();

    // Initialiser les animations des chiffres
    this.initializeDigitAnimations();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Fonction d'easing pour un effet plus naturel
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (this.targetCount - startValue) * easeOutQuart);

      this.animatedCount.set(currentValue);

      // Animer les chiffres individuels avec un délai
      this.animateDigits(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.animatedCount.set(this.targetCount);
        // Finaliser l'animation des chiffres
        this.finalizeDigitAnimations();
      }
    };

    requestAnimationFrame(animate);
  }

  private initializeDigitAnimations(): void {
    const digits = this.targetCount.toString().split('').map(Number);
    const animations = digits.map((digit, index) => ({
      digit,
      isAnimating: false,
      delay: index * 150 // Délai de 150ms entre chaque chiffre pour un effet plus rapide
    }));
    this.digitAnimations.set(animations);
  }

  private animateDigits(currentValue: number): void {
    const currentDigits = currentValue.toString().padStart(this.targetCount.toString().length, '0').split('').map(Number);
    const animations = this.digitAnimations();

    currentDigits.forEach((digit, index) => {
      if (animations[index] && !animations[index].isAnimating) {
        // Démarrer l'animation pour ce chiffre
        setTimeout(() => {
          animations[index].isAnimating = true;
          this.digitAnimations.set([...animations]);
        }, animations[index].delay);
      }
    });
  }

  private finalizeDigitAnimations(): void {
    const animations = this.digitAnimations();
    animations.forEach(animation => {
      animation.isAnimating = false;
    });
    this.digitAnimations.set([...animations]);
  }

  getDigits(): number[] {
    return this.animatedCount().toString().padStart(this.targetCount.toString().length, '0').split('').map(Number);
  }

  getCardVariation(index: number) {
    return this.cardVariations[index % this.cardVariations.length];
  }

  getParticipationsForTriclope(triclopeId: string): Participation[] {
    return this.participations().filter(p => p.triclopeId === triclopeId);
  }

  getIconPositionClass(): string {
    const ratio = this.progressRatio();

    if (ratio > 0) {
      return 'icon-right';
    } else if (ratio < 0) {
      return 'icon-left';
    } else {
      return 'icon-center';
    }
  }

  shouldFlipIcon(): boolean {
    return this.progressRatio() < 0;
  }

  private calculateProgressRatio(): void {
    const given = this.cigarettesGiven();
    const received = this.cigarettesReceived();

    // Calculate ratio on scale of -100 to 100
    // Positive = more given than received (good)
    // Negative = more received than given (bad)
    const netGiven = given - received;
    const ratio = Math.max(-100, Math.min(100, netGiven));

    this.progressRatio.set(ratio);

    // Calculate progress bar fill
    // Center is at 50%, fill extends from center to one side only
    const centerPosition = 50; // 50% is center

    if (ratio === 0) {
      // Zero ratio: show only a small indicator at center
      this.progressFillWidth.set(2); // Small width for center indicator
      this.progressFillLeft.set(centerPosition - 1); // Center the small indicator
    } else if (ratio > 0) {
      // Positive ratio: fill from center to the right
      const fillWidth = (ratio / 100) * centerPosition; // Max 50% width
      this.progressFillWidth.set(fillWidth);
      this.progressFillLeft.set(centerPosition);
    } else {
      // Negative ratio: fill from left to center
      const fillWidth = (Math.abs(ratio) / 100) * centerPosition; // Max 50% width
      this.progressFillWidth.set(fillWidth);
      this.progressFillLeft.set(centerPosition - fillWidth);
    }
  }

  // Test methods for different scenarios
  testPositiveRatio(): void {
    this.cigarettesGiven.set(75);
    this.cigarettesReceived.set(25);
    this.calculateProgressRatio();
  }

  testNegativeRatio(): void {
    this.cigarettesGiven.set(20);
    this.cigarettesReceived.set(80);
    this.calculateProgressRatio();
  }

  testBalancedRatio(): void {
    this.cigarettesGiven.set(50);
    this.cigarettesReceived.set(50);
    this.calculateProgressRatio();
  }

  testExtremePositive(): void {
    this.cigarettesGiven.set(150);
    this.cigarettesReceived.set(0);
    this.calculateProgressRatio();
  }

  testExtremeNegative(): void {
    this.cigarettesGiven.set(0);
    this.cigarettesReceived.set(150);
    this.calculateProgressRatio();
  }
}