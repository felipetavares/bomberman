package bazingafive.bomberman.telas;

import javax.swing.JOptionPane;
import java.awt.Graphics;
import java.awt.Color;
import java.awt.FontMetrics;
import bazingafive.bomberman.telas.CreditosIniciais;
import java.awt.event.KeyEvent;

public class Menu implements Tela {
	private boolean primeiraVez = true;
	private int comprimento, altura;

	public int getComprimento () {
		return comprimento;
	}

	public int getAltura () {
		return altura;
	}

	public void setTamanho (int comprimento, int altura) {
		this.comprimento = comprimento;
		this.altura = altura;
	}

	public void teclaPressionada(KeyEvent e) {
		
	}

	public void desenhaTextoCentrado (Graphics g, String texto, int y) {
		g.drawString(texto, 400-g.getFontMetrics().stringWidth(texto), y);
	}

	public void desenhar (Graphics g) {
		int entrada = 0;

		// Desenha um fundo azul
		g.setColor(Color.blue);
		g.fillRect (0,0,800,600);

		// Desenha menu
		g.setColor(new Color(0xff,0x44,0xff));
		desenhaTextoCentrado(g, "Menu", 50);

		/*
		System.out.println ("[menu]");
		System.out.println ("1. Créditos");
		System.out.println ("2. Instruções");
		System.out.println ("3. Jogar");
		System.out.println ("4. Sair");

		do {
			// O try é para caso a string entrada pelo usuário não seja um número
			try {
				entrada = Integer.parseInt(JOptionPane.showInputDialog (null,"Opção:"));
			} catch (Exception e) {
				System.out.println ("Entre um número.");
			}
		} while (entrada <= 0 || entrada > 4);

		switch (entrada) {
			case 1:
				proxima = creditosIniciais;
			break;
			case 2:
				proxima = instrucoes;
			break;
			case 3:
				proxima = bomberman;
			break;
			case 4:
				proxima = null;
			break;
		}
		*/
	}

	public int getProximaTela () {
		if (primeiraVez == true) {
			primeiraVez = false;
			//return 1;
			return 2;
		} else 
			return 2;
	}
}