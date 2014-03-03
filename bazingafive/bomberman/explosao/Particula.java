package bazingafive.bomberman.explosao;

import java.awt.Graphics;
import java.awt.Color;
import java.lang.Math;

public class Particula {
	// Cor da partícula
	Color cor;
	// Tempo de vida da partícula
	double vida;
	// Posição da partícula
	double x,y;
	// Velocidade da partícula
	double vx,vy;

	// Tempo inicial
	long tempoInicial;

	// Cria uma partícula na posição x,y com velocidade aleatória
	public Particula (double x, double y, Color cor) {
		this.x = x;
		this.y = y;
		this.cor = cor;

		vx = Math.random()*100-50;
		vy = Math.random()*100-50;
	
		vida = Math.random()*1;
	
		// Pega o tempo atual
		tempoInicial = System.currentTimeMillis();
	}

	// Euler simples, considerando tempo fixo
	public void atualiza () {
		long deltaTempo = System.currentTimeMillis()-tempoInicial;

		// Atualiza a posição baseado na velocidade
		x += vx*(double)deltaTempo/1000;
		y += vy*(double)deltaTempo/1000;

		// Atualiza a velocidade aplicando um atrito fixe
		vx *= 0.99;
		vy *= 0.99;

		// Diminui a vida
		vida -= (double)deltaTempo/1000;
	}

	// Desenha a partícula
	public void desenhar (Graphics g) {
		// Se a partícula ainda estiver viva
		if (vida > 0) {
			// Possivelmente chamaremos em outro lugar
			atualiza();
		
			g.setColor(cor);
			g.fillRect((int)x-1,(int)y-1,2,2);
		}
	}

	// Verifica se a partícula ainda está viva
	public boolean estaViva () {
		if (vida > 0)
			return true;
		else
			return false;
	}
}