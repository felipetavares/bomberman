package bazingafive.bomberman.telas;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.awt.AlphaComposite;
import java.math.*;
import java.lang.Math;
import java.awt.event.KeyEvent;

public class CreditosIniciais implements Tela {
	private BufferedImage logo = null;
	private long tempoInicial;
	private int comprimento, altura;

	public void setTamanho (int comprimento, int altura) {
		this.comprimento = comprimento;
		this.altura = altura;
	}

	public void teclaPressionada(KeyEvent e) {
		
	}

	public CreditosIniciais () {
		System.out.println ("Carregando logo...");

		try {
		    logo = ImageIO.read(CreditosIniciais.class.getResourceAsStream("/bazingafive/bomberman/imagens/bazinga.png"));
		} catch (IOException e) {
			System.out.println("Não consegui carregar o logo: "+e.getMessage());
		}

		System.out.println ("Logo carregado.");
	
		tempoInicial = System.currentTimeMillis();
	}

	public void desenhar (Graphics g) {
		float alpha = (float)(System.currentTimeMillis()-tempoInicial)/2500f*(float)Math.PI;
		alpha = (float)Math.cos(alpha+Math.PI/2);

		if (alpha > 1)
			alpha = 1f;
		if (alpha < 0.0)
			alpha = 0.0f;

		g.setColor(Color.red);
		g.fillRect(0,0,comprimento,altura);

		AlphaComposite ac = java.awt.AlphaComposite.getInstance(AlphaComposite.SRC_OVER, alpha);
		((Graphics2D)g).setComposite(ac);
		g.drawImage(logo,comprimento/2-logo.getWidth()/2, altura/2-logo.getHeight()/2,null);
	}

	public int getProximaTela () {
		if (System.currentTimeMillis()-tempoInicial >= 5000) {
			return 0;
		}
		else
			return 1;
	}
}
