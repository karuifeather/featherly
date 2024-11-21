import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PortalComponent {}
