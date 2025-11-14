import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Encomendas from './Encomendas';
import { ClienteProvider } from '../../context/ClienteContext';

const mockOpen = jest.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen,
});

const mockEncodeURIComponent = jest.fn((str) => str);
Object.defineProperty(window, 'encodeURIComponent', {
  writable: true,
  value: mockEncodeURIComponent,
});

const renderEncomendas = () => {
  return render(
    <BrowserRouter>
      <ClienteProvider>
        <Encomendas />
      </ClienteProvider>
    </BrowserRouter>
  );
};

describe.skip('Encomendas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o título da página', () => {
    renderEncomendas();

    const title = screen.getByRole('heading', {
      name: /encomendas personalizadas/i,
    });
    expect(title).toBeInTheDocument();
  });

  it('deve renderizar todo o conteúdo sobre encomendas', () => {
    renderEncomendas();

    expect(
      screen.getByText(/além dos nossos produtos deliciosos à pronta entrega/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/atendemos também pedidos corporativos/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/aceitamos encomendas com até 48h de antecedência/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/o pagamento é feito em duas etapas/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/para conhecer nosso catálogo completo/i)
    ).toBeInTheDocument();
  });

  it('deve renderizar o texto sobre cancelamentos em negrito', () => {
    renderEncomendas();

    const cancelamentoText = screen.getByText(
      /cancelamentos são possíveis em até 24h antes da entrega/i
    );
    expect(cancelamentoText).toBeInTheDocument();
    expect(cancelamentoText.tagName).toBe('STRONG');
  });

  it('deve renderizar o botão de WhatsApp', () => {
    renderEncomendas();

    const whatsappButton = screen.getByRole('button', {
      name: /realizar encomenda/i,
    });
    expect(whatsappButton).toBeInTheDocument();
  });

  it('deve renderizar a imagem da torta', () => {
    renderEncomendas();

    const image = screen.getByAltText(/torta personalizada da se doce fosse/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'alt',
      'Torta personalizada da Se Doce Fosse'
    );
  });

  it('deve abrir o WhatsApp quando o botão for clicado', () => {
    // Mock navigator.userAgent para simular desktop
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });

    renderEncomendas();

    const whatsappButton = screen.getByRole('button', {
      name: /realizar encomenda/i,
    });
    fireEvent.click(whatsappButton);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://web.whatsapp.com/send?phone=5551994527855&text=Olá! Gostaria de fazer uma encomenda personalizada. Pode me ajudar?',
      '_blank'
    );
  });

  it('deve usar wa.me em dispositivos mobile', () => {
    // Mock navigator.userAgent para simular mobile
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
    });

    renderEncomendas();

    const whatsappButton = screen.getByRole('button', {
      name: /realizar encomenda/i,
    });
    fireEvent.click(whatsappButton);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://wa.me/5551994527855?text=Olá! Gostaria de fazer uma encomenda personalizada. Pode me ajudar?',
      '_blank'
    );
  });

  it('deve ter a estrutura correta do layout', () => {
    renderEncomendas();

    expect(
      screen.getByRole('heading', { name: /encomendas personalizadas/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /realizar encomenda/i })
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/torta personalizada da se doce fosse/i)
    ).toBeInTheDocument();
  });

  it('deve conter informações sobre pagamento', () => {
    renderEncomendas();

    expect(
      screen.getByText(/50% no ato da encomenda e 50% antes da entrega/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/pix ou cartão de crédito/i)).toBeInTheDocument();
  });

  it('deve conter informações sobre prazos', () => {
    renderEncomendas();

    expect(screen.getByText(/48h de antecedência/i)).toBeInTheDocument();
    expect(screen.getByText(/24h antes da entrega/i)).toBeInTheDocument();
  });
});
