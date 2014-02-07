class Menu implements Tela {
	Tela creditos = new Creditos();
	Tela instrucoes = new Instrucoes();
	Tela bomberman = new Bomberman();
	Tela menu = null;

	public void setTelaInicial (Tela menu) {
		this.menu = menu;
	}

	public void desenhar () {
		System.out.println ("[menu]");
	}

	public Tela getProximaTela () {
		return this;
	}
}