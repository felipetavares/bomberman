class Jogo {
	// Tela que está sendo desenhada
	Tela tela = null;

	Tela menu = new Menu();

	// Método principal
	public static void main (String[] args) {
		System.out.println ("Bazinga Five Studios");
	
		// Cria o jogo
		Jogo jogo = new Jogo();
		
		// Roda jogo
		jogo.rodar();
	}

	// Construtor
	public Jogo () {
		telaInicial();
	}

	public void telaInicial () {
		tela = menu;
	}

	public void rodar () {
		do {
			tela.desenhar();
			tela = tela.getProximaTela();
		} while (true);
	}
}