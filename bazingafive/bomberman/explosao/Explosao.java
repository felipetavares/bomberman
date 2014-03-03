package bazingafive.bomberman.explosao;

import bazingafive.bomberman.telas.Tela;
import java.util.Vector;
import java.awt.Graphics;
import java.awt.Color;

public class Explosao {
	private Vector <Particula> particulas = new Vector<Particula>();
	private boolean terminou;
	private int x,y;
	private Color cor;
	private int r;

	public Explosao (int x, int y, int num, Color cor) {
		// Cria várias partículas
		for (int i=0;i<num;i++)
			particulas.addElement(new Particula((double)x,(double)y,cor));

		this.x = x;
		this.y = y;
		this.cor = cor;

		r = 0;
		terminou = false;
	}

	public void desenhar (Tela tela, Graphics g) {
		terminou = true;
		for (int i=0;i<particulas.size();i++) {
			particulas.elementAt(i).desenhar(g);
			if (particulas.elementAt(i).estaViva())
				terminou = false;
		}

		//g.setColor (cor);
		//g.fillOval(x-r/2,y-r/2,r,r);
		//r+=1;
	}

	public boolean getTerminou () {
		return terminou;
	}
}