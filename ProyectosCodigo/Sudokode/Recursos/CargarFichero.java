package si2025.jesusdavidcalvente083alu.p05.Recursos;

import java.io.*;
import java.util.*;

public class CargarFichero {
	
	
		public static ArrayList<Tablero> cargarTableros(String rutaArchivo) throws IOException {
			
		ArrayList<Tablero> tableros = new ArrayList<>();

		try (BufferedReader br = new BufferedReader(new FileReader(rutaArchivo))) {
			String linea;
			while ((linea = br.readLine()) != null) {
				if (linea.length() != 81) {
					System.err.println("Línea inválida (longitud incorrecta): " + linea);
					continue;
				}
				tableros.add(parsearTablero(linea));
			}
		}

		return tableros;
	}

	private static Tablero parsearTablero(String linea) {
		int[][] tablero = new int[9][9];

		for (int i = 0; i < 81; i++) {
			char c = linea.charAt(i);
			int fila = i / 9;
			int columna = i % 9;

			if (c == '.') {
				tablero[fila][columna] = 0;
			} else if (Character.isDigit(c)) {
				tablero[fila][columna] = Character.getNumericValue(c);
			} else {
				System.out.println("Carácter no reconocido en el tablero: " + c);
			}
		}

		return new Tablero(tablero);
	}


}
