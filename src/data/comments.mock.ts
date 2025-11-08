export interface Comment {
  id: string;
  name: string;
  description: string;
  rating: number;
  createdAt: string;
}

export const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    name: 'Maria Silva',
    description:
      'Adorei os produtos! A qualidade é excelente e o atendimento foi impecável. Recomendo a todos! lorenm ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    rating: 5,
    createdAt: '2024-10-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'João Santos',
    description: 'Entrega rápida e produtos fresquinhos! Sempre compro aqui.',
    rating: 4,
    createdAt: '2024-10-14T14:22:00Z',
  },
  {
    id: '3',
    name: 'Ana Costa',
    description: 'Variedade incrível e preços justos. Super recomendo!',
    rating: 5,
    createdAt: '2024-10-13T16:45:00Z',
  },
  {
    id: '4',
    name: 'Carlos Lima',
    description: 'Atendimento excepcional e produtos de primeira qualidade!',
    rating: 5,
    createdAt: '2024-10-12T09:15:00Z',
  },
  {
    id: '5',
    name: 'Fernanda Souza',
    description: 'Já sou cliente há anos, nunca me decepcionaram.',
    rating: 4,
    createdAt: '2024-10-11T11:30:00Z',
  },
  {
    id: '6',
    name: 'Roberto Silva',
    description: 'Melhor loja de doces da região, sem dúvida!',
    rating: 5,
    createdAt: '2024-10-10T15:20:00Z',
  },
  {
    id: '7',
    name: 'Juliana Oliveira',
    description:
      'Produtos maravilhosos e equipe muito atenciosa. Voltarei sempre!',
    rating: 5,
    createdAt: '2024-10-09T13:45:00Z',
  },
  {
    id: '8',
    name: 'Pedro Ferreira',
    description:
      'Qualidade excepcional nos doces. Sabor caseiro que me lembra da minha infância.',
    rating: 4,
    createdAt: '2024-10-08T18:10:00Z',
  },
  {
    id: '9',
    name: 'Camila Rodrigues',
    description:
      'Ambiente acolhedor e produtos deliciosos. Uma experiência única!',
    rating: 5,
    createdAt: '2024-10-07T12:30:00Z',
  },
];
