package si2025.jesusdavidcalvente083alu.p05.Recursos;

import java.util.Arrays;

public class Tablero {

    private int[][] tablero;

    // Constructor para un tablero vacío
    public Tablero() {
        tablero = new int[9][9];  // Tablero de 9x9
        for (int i = 0; i < 9; i++) {
            Arrays.fill(tablero[i], 0);  // Llenamos todas las celdas con 0
        }
    }

    // Constructor para inicializar el tablero con un tablero predefinido
    public Tablero(int[][] t) {
        if (t == null || t.length != 9 || t[0].length != 9) {
            throw new IllegalArgumentException("El tablero debe ser una matriz de 9x9.");
        }
        this.tablero = t;
    }

    // Obtener el tablero completo
    public int[][] getTablero() {
        return Arrays.copyOf(tablero, tablero.length);  // Retornamos una copia para evitar modificaciones externas
    }
    
    public int[] getFila(int f) {
		if (f < 0 || f >= 9) throw new IllegalArgumentException("Índice de fila fuera de rango.");
		return Arrays.copyOf(tablero[f], tablero[f].length);  
	}

    
    // Obtener una celda del tablero
    public int getCelda(int f, int c) {
        if (f < 0 || f >= 9 || c < 0 || c >= 9) throw new IllegalArgumentException("Índices fuera de rango.");
        return tablero[f][c];
    }
    

    // Establecer el valor de una celda del tablero
    public void setCelda(int f, int c, int valor) {
        if (f < 0 || f >= 9 || c < 0 || c >= 9) throw new IllegalArgumentException("Índices fuera de rango.");
        if (valor < 0 || valor > 9) throw new IllegalArgumentException("El valor debe estar entre 0 y 9.");
        tablero[f][c] = valor;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 9; i++) {
            if (i % 3 == 0 && i != 0) sb.append("------+-------+------\n");
            for (int j = 0; j < 9; j++) {
                if (j % 3 == 0 && j != 0) sb.append("| ");
                sb.append(tablero[i][j] == 0 ? ". " : tablero[i][j] + " ");
            }
            sb.append("\n");
        }
        return sb.toString();
    }
}
