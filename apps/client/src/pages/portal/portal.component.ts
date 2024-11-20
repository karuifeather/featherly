import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PortalComponent {}
