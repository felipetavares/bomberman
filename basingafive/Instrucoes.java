class Instrucoes implements Tela {
	Tela menu;

	public void setTelaInicial (Tela menu) {
		this.menu = menu;
	}

	public void desenhar () {
		System.out.println ("[Instrucoes]");
	}

	public Tela getProximaTela () {
		return menu;
	}
}