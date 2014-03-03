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
import java.awt.Font;

import bazingafive.bomberman.explosao.Explosao;

public class CreditosIniciais implements Tela {
	private BufferedImage logo = null;
	private long tempoInicial;
	private int comprimento, altura;
	private int creditoAtual = 0;

	private String creditos[] = {
		"","","","",
		"Bazinga Five Studios",
		"",
		"Felipe Tavares (programming/art tips)","",	
		"Gabriel Araújo (leader artist/ideas)","",
		"Ana Cecília","",
		"Camila Medeiros","",
		"Cíntia Alves",
		"",
		"presents","",
		"InFeRNo",
		"",
		"a Rayslla Almeida game",
		"",
	};

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

	public void desenhaTextoCentrado (Graphics g, String texto, int y) {
		double time = (double)((System.currentTimeMillis()-tempoInicial))/1000.0;
		g.drawString(texto, comprimento/2-g.getFontMetrics().stringWidth(texto)/2+(int)(Math.sin(time)*comprimento/8),
							y+(int)(Math.cos(time)*comprimento/8));
	}

	public void desenhar (Graphics g) {
		creditoAtual = (int)(System.currentTimeMillis()-tempoInicial)/2500;
		float alpha = (float)((System.currentTimeMillis()-tempoInicial)%2500)/2500f*(float)Math.PI;

		alpha = (float)Math.cos(alpha-Math.PI/2);

		if (alpha > 0.9)
			alpha = 1f;
		if (alpha < 0.1)
			alpha = 0.0f;

		g.setColor(Color.black);
		g.fillRect(0,0,comprimento,altura);

		// Transparência, fica muito pesado
		//AlphaComposite ac = java.awt.AlphaComposite.getInstance(AlphaComposite.SRC_OVER, alpha);
		//((Graphics2D)g).setComposite(ac);

		if (creditoAtual == creditos.length-1) {
			// Imagem
			g.drawImage(logo,comprimento/2-logo.getWidth()/2, altura/2-logo.getHeight()/2,null);
		} else {
			int tamanhoFonte = (comprimento-100)/(creditos[creditoAtual].length()+3);
			if (tamanhoFonte > 40)
				tamanhoFonte = 40;
			Font font = new Font("Serif", Font.PLAIN, tamanhoFonte);
			g.setFont(font);

			g.setColor(new Color(0xff,0xff,0xff));
			desenhaTextoCentrado(g, creditos[creditoAtual], altura/2);
		}
	}

	public int getProximaTela () {
		if (System.currentTimeMillis()-tempoInicial >= 2500*(creditos.length)-100) {
			return 0;
		}
		else
			return 1;
	}
}
