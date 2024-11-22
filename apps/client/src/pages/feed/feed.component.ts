import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-feed',
  imports: [CommonModule],
  templateUrl: './feed.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FeedComponent {
  tourPosts = [
    {
      title: 'The Great Canyon Adventure',
      description: 'Explore the stunning views of the Grand Canyon.',
      images: [
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-9_dz9zov.jpg',
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-8_tv2m3g.jpg',
      ],
      likes: 123,
      comments: [
        { user: 'Jane Doe', text: 'This place looks amazing!' },
        { user: 'John Smith', text: 'Can’t wait to visit!' },
      ],
    },
    {
      title: 'The Great Canyon Adventure',
      description: 'Explore the stunning views of the Grand Canyon.',
      images: [
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-9_dz9zov.jpg',
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-8_tv2m3g.jpg',
      ],
      likes: 123,
      comments: [
        { user: 'Jane Doe', text: 'This place looks amazing!' },
        { user: 'John Smith', text: 'Can’t wait to visit!' },
      ],
    },
    // Add more posts as needed
  ];
}
