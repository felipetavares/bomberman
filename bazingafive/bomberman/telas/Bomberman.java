package bazingafive.bomberman.telas;

import java.awt.Graphics;
import java.awt.Color;
import java.awt.event.KeyEvent;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Vector;

abstract class Objeto {
	public static enum Tipo {TP_PAREDE,TP_JOGADOR,TP_PISO,TP_BOMBA};
	public boolean executado;
	int x,y;

	public Objeto (int x, int y) {
		this.x = x;
		this.y = y;
	}

	public void mover (Mapa mapa, int x, int y) {
		mapa.removeObjeto(this.x,this.y, this);
		this.x = x;
		this.y = y;
		mapa.setObjeto(this.x,this.y, this);		
	}

	public void teclaPressionada (Mapa mapa, KeyEvent e) {

	}

	public void carregar () {

	}

	public void desenhar (Graphics g, int comprimento, int altura) {

	}

	public Tipo getTipo () {
		return null;
	}
}

class Bomba extends Objeto {
	private BufferedImage imagem;
	private int tempoInicial;

	public Bomba (int x, int y) {
		super(x,y);
		// Inicio da implementação do tempo
		tempoInicial = System.currentTimeMillis();
	}

	//@override
	public void carregar () {
		try {
		    imagem = ImageIO.read(new File("bazingafive/bomberman/imagens/bomba/0.png"));
		} catch (IOException e) {
			System.out.println("Não consegui carregar a bomba: "+e.getMessage());
		}
	}

	//@override
	public void desenhar (Graphics g, int comprimento, int altura) {
		g.drawImage(imagem,comprimento*x/8+10,(altura-20)*y/8,null);
	}

	public Tipo getTipo () {
		return Tipo.TP_BOMBA;
	}
}

class Piso extends Objeto {
	private BufferedImage imagem;

	public Piso (int x, int y) {
		super(x,y);
	}

	//@override
	public void carregar () {
		try {
		    imagem = ImageIO.read(new File("bazingafive/bomberman/imagens/paredes/1.png"));
		} catch (IOException e) {
			System.out.println("Não consegui carregar o piso: "+e.getMessage());
		}
	}

	//@override
	public void desenhar (Graphics g, int comprimento, int altura) {
		g.drawImage(imagem,comprimento*x/8,(altura-20)*y/8,null);
	}

	public Tipo getTipo () {
		return Tipo.TP_PISO;
	}
}

class Parede extends Objeto {
	private BufferedImage imagem;

	public Parede (int x, int y) {
		super(x,y);
	}

	//@override
	public void carregar () {
		try {
		    imagem = ImageIO.read(new File("bazingafive/bomberman/imagens/paredes/0.png"));
		} catch (IOException e) {
			System.out.println("Não consegui carregar a parede: "+e.getMessage());
		}
	}

	//@override
	public void desenhar (Graphics g, int comprimento, int altura) {
		g.drawImage(imagem,comprimento*x/8,(altura-20)*y/8,null);
	}

	public Tipo getTipo () {
		return Tipo.TP_PAREDE;
	}
}

class Jogador extends Objeto {
	private BufferedImage[] imagens = new BufferedImage[4];

	private int direcao = 0;

	public Jogador (int x, int y) {
		super(x,y);
	}

	//@override
	public void carregar () {
		try {
		    imagens[0] = ImageIO.read(new File("bazingafive/bomberman/imagens/bomberman/0.png"));
		    imagens[1] = ImageIO.read(new File("bazingafive/bomberman/imagens/bomberman/1.png"));
		    imagens[2] = ImageIO.read(new File("bazingafive/bomberman/imagens/bomberman/2.png"));
		    imagens[3] = ImageIO.read(new File("bazingafive/bomberman/imagens/bomberman/3.png"));
		} catch (IOException e) {
			System.out.println("Não consegui carregar o bomberman: "+e.getMessage());
		}
	}

	boolean naoParede (Vector<Objeto> objetos) {
		for (int i=0;i<objetos.size();i++)
			if (objetos.elementAt(i).getTipo() == Objeto.Tipo.TP_PAREDE)
				return false;
		return true;
	}

	//@override
	public void mover (Mapa mapa, int x, int y) {
		if (mapa.inside(x,y) && 
			(mapa.getObjetos(x,y).size() > 0 &&
			 naoParede(mapa.getObjetos(x,y))) ||
			 mapa.getObjetos(x,y).size() == 0) {
			mapa.removeObjeto(this.x,this.y, this);
			this.x = x;
			this.y = y;
			mapa.setObjeto(this.x,this.y, this);
		}
	}

	//@override
	public void teclaPressionada (Mapa mapa, KeyEvent e) {
		if (e.getKeyCode() == KeyEvent.VK_LEFT) {
			mover(mapa, x-1, y);
			direcao = 2;
		} else
		if (e.getKeyCode() == KeyEvent.VK_RIGHT) {
			mover(mapa, x+1, y);
			direcao = 3;
		} else
		if (e.getKeyCode() == KeyEvent.VK_UP) {
			mover(mapa, x, y-1);
			direcao = 1;
		} else
		if (e.getKeyCode() == KeyEvent.VK_DOWN) {
			mover(mapa, x, y+1);
			direcao = 0;
		}
		if (e.getKeyCode() == KeyEvent.VK_SPACE) {
			colocaBomba(mapa);
		}
	}

	void colocaBomba (Mapa mapa) {
		Objeto bomba = new Bomba(x,y);
		bomba.carregar();
		mapa.setObjeto(x,y, bomba);
	}

	//@override
	public void desenhar (Graphics g, int comprimento, int altura) {
		g.drawImage(imagens[direcao],comprimento*x/8+16,(altura-20)*y/8,null);
	}	

	public Tipo getTipo () {
		return Tipo.TP_JOGADOR;
	}
}

class Mapa {
	Vector <Vector<Vector<Objeto>>> objetos = new Vector <Vector<Vector<Objeto>>> ();

	Mapa () {
		for (int y=0;y<8;y++) {
			objetos.addElement (new Vector<Vector<Objeto>>());
			for (int x=0;x<8;x++) {
				objetos.elementAt(y).addElement(new Vector<Objeto>());
			}
		}
	}

	public void removeObjeto (int x, int y, Objeto o) {
		if (inside(x,y)) {
			objetos.elementAt(y).elementAt(x).remove(o);
		}
	}

	public void setObjeto (int x, int y, Objeto o) {
		if (inside (x,y)) {
			objetos.elementAt(y).elementAt(x).addElement(o);
		}
	}

	public Objeto getObjeto (int x, int y) {
		if (inside(x,y)) {
			if (objetos.elementAt(y).elementAt(x).size() > 0)
				return objetos.elementAt(y).elementAt(x).elementAt(0);
			else
				return null;
		}
		else
			return null;
	}

	public Vector <Objeto> getObjetos (int x, int y) {
		if (inside(x,y)) {
			return objetos.elementAt(y).elementAt(x);
		}
		else
			return null;
	}

	public boolean inside (int x,int y) {
		if (x >= 0 && x < 8 &&
			y >= 0 && y < 8)
			return true;
		return false;
	}
}

public class Bomberman implements Tela {
	Mapa mapa = new Mapa();
	private int comprimento, altura;

	public void setTamanho (int comprimento, int altura) {
		this.comprimento = comprimento;
		this.altura = altura;
	}

	public void teclaPressionada(KeyEvent e) {
		for (int y=0;y<8;y++)
			for (int x=0;x<8;x++) {
				for (int z=0;z<mapa.getObjetos(x,y).size();z++) {
					if (mapa.getObjetos(x,y).elementAt(z).executado == false) {
						mapa.getObjetos(x,y).elementAt(z).executado = true;
						mapa.getObjetos(x,y).elementAt(z).teclaPressionada(mapa, e);
					}
				}
			}
	}

	public Bomberman () {
		for (int y=0;y<8;y++)
			for (int x=0;x<8;x++) {
				if (x == 0 || y == 0 || x == 7 || y == 7)
					mapa.setObjeto(x,y,new Parede(x,y));
				else
					mapa.setObjeto(x,y,new Piso(x,y));

				if (x == 4 && y == 4)
					mapa.setObjeto(x,y,new Jogador(x,y));

				for (int i=0;i<mapa.getObjetos(x,y).size();i++)
					mapa.getObjetos(x,y).elementAt(i).carregar();
			}
	}

	public void desenhar (Graphics g) {
		g.setColor(Color.black);
		g.fillRect(0,0,comprimento,altura);

		for (int y=0;y<8;y++)
			for (int x=0;x<8;x++) {
				for (int z=0;z<mapa.getObjetos(x,y).size();z++) {
					if (mapa.getObjetos(x,y).elementAt(z).getTipo() == Objeto.Tipo.TP_PAREDE ||
						mapa.getObjetos(x,y).elementAt(z).getTipo() == Objeto.Tipo.TP_PISO ||
						mapa.getObjetos(x,y).elementAt(z).getTipo() == Objeto.Tipo.TP_BOMBA) {
						mapa.getObjetos(x,y).elementAt(z).desenhar(g,comprimento,altura);
						mapa.getObjetos(x,y).elementAt(z).executado = false;
					}
				}
				for (int z=0;z<mapa.getObjetos(x,y).size();z++) {
					if (mapa.getObjetos(x,y).elementAt(z).getTipo() == Objeto.Tipo.TP_JOGADOR) {
						mapa.getObjetos(x,y).elementAt(z).desenhar(g,comprimento,altura);
						mapa.getObjetos(x,y).elementAt(z).executado = false;
					}
				}
			}
	}

	public int getProximaTela () {
		return 2;
	}
}