package bazingafive.bomberman.telas;

import java.awt.Graphics;
import java.awt.event.KeyEvent;

public class Instrucoes implements Tela {
	private int comprimento, altura;

	public void setTamanho (int comprimento, int altura) {
		this.comprimento = comprimento;
		this.altura = altura;
	}

	public void teclaPressionada(KeyEvent e) {
		
	}

	public void desenhar (Graphics g) {
		System.out.println ("[Instrucoes]");
	}

	public int getProximaTela () {
		return 0;
	}
}
