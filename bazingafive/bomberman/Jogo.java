package bazingafive.bomberman;

import bazingafive.bomberman.telas.*;
import bazingafive.bomberman.janela.Janela;
import java.awt.image.BufferStrategy;
import javax.swing.Timer;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.InputEvent;
import java.util.TimerTask;
import javax.swing.JFrame;
import java.awt.Canvas;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Robot;
import java.awt.RenderingHints;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Point;
import java.awt.image.BufferedImage;

class Jogo extends Canvas implements ActionListener,KeyListener {
	static GraphicsDevice monitor = GraphicsEnvironment
        .getLocalGraphicsEnvironment().getScreenDevices()[0];

	// Quem está pressionado ou não
	private boolean teclas[] = new boolean[1024];

	// Buffer
	private BufferStrategy strategy;

	// Lista de todas as telas utilizadas no jogo
	private Tela[] telas = new Tela[5];
	// Número da tela a ser desenhada
	private int tela = 0;	

	// Janela
	private Janela janela;

	private int comprimento,altura;

	// Método principal
	public static void main (String[] args) {
		System.out.println ("Bazinga Five Studios");
	
		// Cria o jogo
		Jogo jogo = new Jogo();
		
		// Roda jogo
		jogo.rodar();
	}

	// Construtor
	public Jogo () {
		comprimento = monitor.getDisplayMode().getWidth();
		altura = monitor.getDisplayMode().getHeight();

		System.out.println ("Abrindo janela ("+comprimento+","+altura+")");

		telas[0] = new Menu();
		telas[1] = new CreditosIniciais();
		telas[2] = new Bomberman();
		telas[3] = new Instrucoes();
		telas[4] = new Creditos();
		tela = 0;

		for (int i=0;i<5;i++)
			telas[i].setTamanho (comprimento,altura);

		janela = new Janela("Bomberman - Bz5");
		janela.setBounds(0,0,comprimento,altura);
		janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		janela.add(this);
		setIgnoreRepaint(true);

		janela.setVisible(true);
		// Coloca em full-screen
		monitor.setFullScreenWindow(janela);

		// Remove cursor
		janela.setCursor(janela.getToolkit().createCustomCursor(
		        new BufferedImage(3, 3, BufferedImage.TYPE_INT_ARGB), new Point(0, 0),
		        "null"));



		requestFocus();

		addKeyListener(this);

		createBufferStrategy(2);
		strategy = getBufferStrategy();

		Timer timer = new Timer(10, this);
		timer.start();
	}

	public void actionPerformed (ActionEvent e) {
		rodar();
		
		try {
			Robot robot = new Robot();
		} catch (Exception ex) {
	        ex.printStackTrace();
		}
	}

	public void keyReleased (KeyEvent e) {
		teclas[e.getKeyCode()] = false;
	}

	public void keyPressed (KeyEvent e) {
		if (teclas[e.getKeyCode()] == false) {
			telas[tela].teclaPressionada(e);
		}
		teclas[e.getKeyCode()] = true;
	}

	public void keyTyped (KeyEvent e) {
	}

	public void rodar () {
		try {
			Graphics2D g = (Graphics2D) strategy.getDrawGraphics();
			g.setRenderingHint(
			        RenderingHints.KEY_TEXT_ANTIALIASING,
			        RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

			telas[tela].desenhar(g);

			g.dispose();
			strategy.show();

			tela = telas[tela].getProximaTela();
		} catch (Exception e) {
			System.out.println ("Erro ao desenhar "+e.getMessage());
		}
	}
}
