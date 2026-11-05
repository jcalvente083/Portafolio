package si2025.jesusdavidcalvente083alu.p05.Recursos;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GuardarTableros {

    public static void guardarTableros(List<Tablero> tableros, String nombreArchivo) {
        
        File archivo = new File(nombreArchivo);

        try (BufferedWriter escritor = new BufferedWriter(new FileWriter(archivo, true))) {
        	
            for (int i = 0; i < tableros.size(); i++) {

                StringBuilder tableroString = new StringBuilder();
                for (int j = 0; j < 9; j++) {
                    int[] fila = tableros.get(i).getFila(j);
                    for (int valor : fila) {
                        tableroString.append(valor);  
                    }
                }
                
                
                escritor.write(tableroString.toString());
                escritor.newLine();  
            }
            System.out.println("Tableros guardados correctamente en: " + nombreArchivo);
        } catch (IOException e) {
            System.err.println("Error al guardar los tableros: " + e.getMessage());
        }
    }
}
