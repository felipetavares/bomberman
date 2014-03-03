package bazingafive.bomberman.telas;

import java.awt.Graphics;
import java.awt.event.KeyEvent;

public interface Tela {
	public void setTamanho (int comprimento,int altura);
	public void teclaPressionada(KeyEvent e);
	public void desenhar (Graphics g);
	public int getProximaTela ();
	public int getComprimento();
	public int getAltura();
}