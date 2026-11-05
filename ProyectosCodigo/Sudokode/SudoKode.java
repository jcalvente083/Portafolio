package si2025.jesusdavidcalvente083alu.p05;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;

import si2025.jesusdavidcalvente083alu.p05.Recursos.*;

public class Practica_05_exe {

	public static void main(String[] args) {

		String rutaArchivo = "src/si2025/jesusdavidcalvente083alu/p05/Tableros/sudokus_1M.txt";
		Scanner scanner = new Scanner(System.in);
		try {
			int resueltos = 0; int noResueltos = 0;
			ArrayList<Tablero> tableros = CargarFichero.cargarTableros(rutaArchivo);
			ArrayList<Tablero> tablerosResueltos = new ArrayList<>();
			
			for (Tablero tablero : tableros) {
				System.out.println(tablero);
				System.out.println("\t\t\t\t" + resueltos+noResueltos);
				SudokuResolver sudokuResolver = new SudokuResolver();
				
				if (sudokuResolver.resolver(tablero)) {
					System.out.println("Tablero resuelto:");
					System.out.println(tablero);
					tablerosResueltos.add(tablero);
					resueltos++;
				} else {
					System.out.println("No se pudo resolver el tablero.");
					tablerosResueltos.add(new Tablero());
					noResueltos++;
				}
				
			}
			// Guardar los tableros resueltos en un archivo
			GuardarTableros.guardarTableros(tablerosResueltos, "src/si2025/jesusdavidcalvente083alu/p05/TablerosResueltos/resueltos.txt");
			System.out.println("-------------------------------------------------------");
			System.out.println("Total de tableros leídos: " + tableros.size());
			System.out.println("Total de tableros resueltos: " + resueltos);
			System.out.println("Total de tableros no resueltos: " + noResueltos);

		} catch (IOException e) {
			System.err.println("Error al cargar el archivo: " + e.getMessage());
		}

	}
}
