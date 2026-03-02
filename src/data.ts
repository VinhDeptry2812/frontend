import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Aurelius Sofa',
    designer: 'Elena Rossi',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000',
    category: 'Seating',
    description: 'A masterpiece of contemporary design, the Aurelius Sofa combines deep-seated comfort with architectural precision. Hand-upholstered in premium Italian velvet.',
    rating: 4.9,
    reviews: 124,
    finishes: ['Midnight Velvet', 'Sage Linen', 'Oatmeal Bouclé']
  },
  {
    id: '2',
    name: 'Orbital Lounge Chair',
    designer: 'Marc Newson',
    price: 2850,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1000',
    category: 'Seating',
    description: 'Sculptural and inviting, the Orbital chair features a unique swivel base and ergonomic contours designed for extended relaxation.',
    rating: 4.8,
    reviews: 86,
    finishes: ['Cognac Leather', 'Noir Leather', 'Slate Wool']
  },
  {
    id: '3',
    name: 'Ethereal Dining Table',
    designer: 'Sora Tanaka',
    price: 5600,
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=1000',
    category: 'Tables',
    description: 'A solid walnut top that appears to float above a minimalist steel frame. Perfect for hosting intimate dinners or grand gatherings.',
    rating: 5.0,
    reviews: 42,
    finishes: ['Walnut/Black Steel', 'Oak/White Steel', 'Ash/Chrome']
  },
  {
    id: '4',
    name: 'Lumina Floor Lamp',
    designer: 'Luca Moretti',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000',
    category: 'Lighting',
    description: 'Warm, diffused light captured in a hand-blown glass sphere, supported by a slender brass stem.',
    rating: 4.7,
    reviews: 53,
    finishes: ['Brushed Brass', 'Matte Black', 'Polished Nickel']
  },
  {
    id: '5',
    name: 'Prism Coffee Table',
    designer: 'Elena Rossi',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1000',
    category: 'Tables',
    description: 'Geometric perfection meets functional art. The Prism table features faceted glass panels that catch and refract light.',
    rating: 4.9,
    reviews: 31,
    finishes: ['Smoked Glass', 'Clear Glass', 'Bronze Glass']
  },
  {
    id: '6',
    name: 'Zenith Bookshelf',
    designer: 'Sora Tanaka',
    price: 3400,
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=1000',
    category: 'Storage',
    description: 'Asymmetric shelving units that create a dynamic display for your most treasured volumes and objects.',
    rating: 4.6,
    reviews: 27,
    finishes: ['Dark Oak', 'Natural Ash', 'Walnut']
  }
];
