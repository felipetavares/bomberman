package bazingafive.bomberman.telas;

import java.awt.Graphics;
import java.awt.Color;
import java.awt.event.KeyEvent;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Vector;
import bazingafive.bomberman.explosao.Explosao;

abstract class Objeto {
	public static enum Tipo {TP_PAREDE,TP_JOGADOR,TP_PISO,TP_BOMBA,TP_PAREDE_METAL};
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

	public int desenhar (Graphics g, int comprimento, int altura, Mapa mapa, Bomberman bomberman) {
		return 0;
	}

	public Tipo getTipo () {
		return null;
	}
}

class Bomba extends Objeto {
	private BufferedImage imagem;
	private long tempoInicial;

	public Bomba (int x, int y) {
		super(x,y);
		// Inicio da implementação do tempo
		tempoInicial = System.currentTimeMillis();
	}

	//@override
	public void carregar () {
		try {
		    imagem = ImageIO.read(Bomba.class.getResourceAsStream("/bazingafive/bomberman/imagens/bomba/0.png"));
		} catch (IOException e) {
			System.out.println("Não consegui carregar a bomba: "+e.getMessage());
		}
	}


	//@override
	public int desenhar (Graphics g, int comprimento, int altura, Mapa mapa, Bomberman bomberman) {
		if (System.currentTimeMillis()-tempoInicial > 2000) {
			explode(mapa,bomberman);
			return 1;
		}

		g.drawImage(imagem,x*32,y*32,null);
		return 0;
	}

	public Tipo getTipo () {
		return Tipo.TP_BOMBA;
	}

	// dx,dy = ponto de destino ix,iy=direção da linha
	private void explodeLinha (Mapa mapa, Bomberman bomberman, int dx, int dy, int ix, int iy, boolean eu) {
		// Ponto da linha
		int lx=x,ly=y;

		do {
			if (!eu) {
				lx += ix;
				ly += iy;
			}
			if (mapa.inside(lx,ly)) {
				bomberman.addExplosao (new Explosao(lx*32+32,ly*32+32, 50, Color.RED));
				for (int o=0;o<mapa.getObjetos(lx,ly).size();o++) {
					if (mapa.getObjetos(lx,ly).elementAt(o).getTipo() == Objeto.Tipo.TP_JOGADOR) {
						Jogador j = (Jogador)mapa.getObjetos(lx,ly).elementAt(o);
						j.mata();
					} else
					if (mapa.getObjetos(lx,ly).elementAt(o).getTipo() == Objeto.Tipo.TP_PAREDE) {
						//bomberman.addExplosao (new Explosao(lx*32+32,ly*32+32,10, new Color(0xff,0xbb,0x80)));
						mapa.getObjetos(lx,ly).remove(o);
						o--;
						break;
					}
				}
			}
			if (eu) {
				lx += ix;
				ly += iy;
			}
		} while (lx != dx || ly != dy);
	}

	private void explode (Mapa mapa, Bomberman bomberman) {
		explodeLinha(mapa, bomberman, x-1, y, -1,0, false);
		explodeLinha(mapa, bomberman, x+1, y, +1,0, false);
		explodeLinha(mapa, bomberman, x, y-1, 0,-1, false);
		explodeLinha(mapa, bomberman, x, y+1, 0,+1, false);
		explodeLinha(mapa, bomberman, x, y, 0,0, true);
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
		    imagem = ImageIO.read(Piso.class.getResourceAsStream("/bazingafive/bomberman/imagens/paredes/1.png"));
		} catch (IOException e) {
			System.out.println("Não consegui carregar o piso: "+e.getMessage());
		}
	}

	//@override
	public int desenhar (Graphics g, int comprimento, int altura, Mapa mapa, Bomberman bomberman) {
		g.drawImage(imagem,x*32,y*32,null);
		return 0;
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
		    imagem = ImageIO.read(Parede.class.getResourceAsStream("/bazingafive/bomberman/imagens/paredes/0.png"));
		} catch (IOException e) {
			System.out.println("Não consegui carregar a parede: "+e.getMessage());
		}
	}

	//@override
	public int desenhar (Graphics g, int comprimento, int altura, Mapa mapa, Bomberman bomberman) {
		g.drawImage(imagem,x*32,y*32,null);
		return 0;
	}

	public Tipo getTipo () {
		return Tipo.TP_PAREDE;
	}
}

class ParedeMetal extends Objeto {
	private BufferedImage imagem;

	public ParedeMetal (int x, int y) {
		super(x,y);
	}

	//@override
	public void carregar () {
		try {
		    imagem = ImageIO.read(Parede.class.getResourceAsStream("/bazingafive/bomberman/imagens/paredes/2.png"));
		} catch (IOException e) {
			System.out.println("Não consegui carregar a parede: "+e.getMessage());
		}
	}

	//@override
	public int desenhar (Graphics g, int comprimento, int altura, Mapa mapa, Bomberman bomberman) {
		
		g.drawImage(imagem,x*32,y*32,null);
		return 0;
	}

	public Tipo getTipo () {
		return Tipo.TP_PAREDE_METAL;
	}
}

class Jogador extends Objeto {
	private int vidas = 3;
	private BufferedImage[] imagens = new BufferedImage[4];
	private BufferedImage vida;

	private int direcao = 0;

	public Jogador (int x, int y) {
		super(x,y);
	}

	//@override
	public void carregar () {
		try {
		    imagens[0] = ImageIO.read(Jogador.class.getResourceAsStream("/bazingafive/bomberman/imagens/bomberman/0.png"));
		    imagens[1] = ImageIO.read(Jogador.class.getResourceAsStream("/bazingafive/bomberman/imagens/bomberman/1.png"));
		    imagens[2] = ImageIO.read(Jogador.class.getResourceAsStream("/bazingafive/bomberman/imagens/bomberman/2.png"));
		    imagens[3] = ImageIO.read(Jogador.class.getResourceAsStream("/bazingafive/bomberman/imagens/bomberman/3.png"));
		    vida = ImageIO.read(Jogador.class.getResourceAsStream("/bazingafive/bomberman/imagens/bomberman/vida.png"));
		} catch (IOException e) {
			System.out.println("Não consegui carregar o bomberman: "+e.getMessage());
		}
	}

	boolean naoParede (Vector<Objeto> objetos) {
		for (int i=0;i<objetos.size();i++)
			if (objetos.elementAt(i).getTipo() == Objeto.Tipo.TP_PAREDE ||
				objetos.elementAt(i).getTipo() == Objeto.Tipo.TP_PAREDE_METAL)
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
	public int desenhar (Graphics g, int comprimento, int altura, Mapa mapa, Bomberman bomberman) {
		g.drawImage(imagens[direcao],x*32,y*32,null);

		for (int v=0;v<vidas;v++)
			g.drawImage(vida,v*32+16,16,null);
		return 0;
	}	

	public void mata () {
		// Tira uma vida
		if (vidas > 0)
			vidas --;
	}

	public Tipo getTipo () {
		return Tipo.TP_JOGADOR;
	}
}

class Mapa {
	private int comprimento,altura;
	private Vector <Vector<Vector<Objeto>>> objetos = new Vector <Vector<Vector<Objeto>>> ();

	public Mapa (int comprimento, int altura) {
		this.comprimento = comprimento;
		this.altura = altura;
		
		for (int y=0;y<altura;y++) {
			objetos.addElement (new Vector<Vector<Objeto>>());
			for (int x=0;x<comprimento;x++) {
				objetos.elementAt(y).addElement(new Vector<Objeto>());
			}
		}
	}

	public int getComprimento () {
		return comprimento;
	}

	public int getAltura () {
		return altura;
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
		if (x >= 0 && x < comprimento &&
			y >= 0 && y < altura)
			return true;
		return false;
	}
}

public class Bomberman implements Tela {
	Vector<Explosao> explosoes = new Vector<Explosao>();
	Mapa mapa = new Mapa(8,8);
	Jogador jogador;

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
		for (int y=0;y<mapa.getAltura();y++)
			for (int x=0;x<mapa.getComprimento();x++) {
				for (int z=0;z<mapa.getObjetos(x,y).size();z++) {
					if (mapa.getObjetos(x,y).elementAt(z).executado == false) {
						mapa.getObjetos(x,y).elementAt(z).executado = true;
						mapa.getObjetos(x,y).elementAt(z).teclaPressionada(mapa, e);
					}
				}
			}
	}

	public Bomberman () {
		for (int y=0;y<mapa.getAltura();y++)
			for (int x=0;x<mapa.getComprimento();x++) {
				mapa.setObjeto(x,y,new Piso(x,y));
				
				if (x == 0 || y == 0 || x == mapa.getComprimento()-1 || y == mapa.getAltura()-1)
					mapa.setObjeto(x,y,new ParedeMetal(x,y));
				else
					mapa.setObjeto(x,y,new Parede(x,y));

				if (x == mapa.getComprimento()/2 && y == mapa.getAltura()/2) {
					jogador = new Jogador(x,y);
					mapa.setObjeto(x,y,jogador);
				} 

				for (int i=0;i<mapa.getObjetos(x,y).size();i++)
					mapa.getObjetos(x,y).elementAt(i).carregar();
			}
	}

	public void desenhar (Graphics g) {
		g.setColor(Color.black);
		g.fillRect(0,0,comprimento,altura);

		for (int y=0;y<mapa.getAltura();y++)
			for (int x=0;x<mapa.getComprimento();x++) {
				Vector <Objeto> objetos = mapa.getObjetos(x,y);
				for (int z=0;z<objetos.size();z++) {
					if (objetos.elementAt(z).desenhar(g,comprimento,altura,mapa,this) == 1) {
						objetos.remove(z);
						z--;
					}
					else
						objetos.elementAt(z).executado = false;
				}
			}

		jogador.desenhar(g,comprimento,altura,mapa,this);

		for (int e=0;e<explosoes.size();e++) {
			if (explosoes.elementAt(e).getTerminou()) {
				explosoes.remove(e);
				e--;
			} else {
				explosoes.elementAt(e).desenhar(this,g);
			}
		}
	}

	public int getProximaTela () {
		return 2;
	}

	public void addExplosao (Explosao explosao) {
		this.explosoes.addElement(explosao);
	}
}