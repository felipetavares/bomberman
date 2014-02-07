class Creditos implements Tela {
	Tela menu;

	public void setTelaInicial (Tela menu) {
		this.menu = menu;
	}

	public void desenhar () {
		System.out.println ("[Creditos]");
	}

	public Tela getProximaTela () {
		return menu;
	}
}