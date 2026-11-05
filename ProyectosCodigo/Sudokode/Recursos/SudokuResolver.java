package si2025.jesusdavidcalvente083alu.p05.Recursos;

import java.util.*;

public class SudokuResolver {
    private static final int SIZE = 9;
    private Map<Pos, Set<Integer>> dominios;

    private static class Pos {
        int fila, columna;

        Pos(int fila, int columna) {
            this.fila = fila;
            this.columna = columna;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Pos pos = (Pos) o;
            return fila == pos.fila && columna == pos.columna;
        }

        @Override
        public int hashCode() {
            return Objects.hash(fila, columna);
        }
    }

    public boolean resolver(Tablero tablero) {
        inicializarDominios(tablero);
        if (!ac3()) return false;

        // ✅ Después de AC-3, intentar backtracking para resolver completamente
        return backtrack(tablero);
    }

    private void inicializarDominios(Tablero tablero) {
        dominios = new HashMap<>();
        for (int fila = 0; fila < SIZE; fila++) {
            for (int col = 0; col < SIZE; col++) {
                int valor = tablero.getCelda(fila, col);
                Pos pos = new Pos(fila, col);
                Set<Integer> dominio = new HashSet<>();
                if (valor != 0) {
                    dominio.add(valor);
                } else {
                    for (int i = 1; i <= SIZE; i++) {
                        dominio.add(i);
                    }
                }
                dominios.put(pos, dominio);
            }
        }
    }

    private boolean ac3() {
        Queue<Pair> cola = new LinkedList<>();
        for (Pos xi : dominios.keySet()) {
            for (Pos xj : vecinos(xi)) {
                cola.add(new Pair(xi, xj));
            }
        }

        while (!cola.isEmpty()) {
            Pair par = cola.poll();
            if (reducir(par.xi, par.xj)) {
                if (dominios.get(par.xi).isEmpty()) return false;
                for (Pos xk : vecinos(par.xi)) {
                    if (!xk.equals(par.xj)) {
                        cola.add(new Pair(xk, par.xi));
                    }
                }
            }
        }
        return true;
    }

    private boolean reducir(Pos xi, Pos xj) {
        boolean reducido = false;
        Set<Integer> di = new HashSet<>(dominios.get(xi));
        Set<Integer> dj = dominios.get(xj);

        for (int val : di) {
            if (dj.size() == 1 && dj.contains(val)) {
                dominios.get(xi).remove(val);
                reducido = true;
            }
        }
        return reducido;
    }

    private List<Pos> vecinos(Pos p) {
        Set<Pos> resultado = new HashSet<>();
        for (int i = 0; i < SIZE; i++) {
            if (i != p.columna) resultado.add(new Pos(p.fila, i));
            if (i != p.fila) resultado.add(new Pos(i, p.columna));
        }

        int filaIni = (p.fila / 3) * 3;
        int colIni = (p.columna / 3) * 3;
        for (int i = filaIni; i < filaIni + 3; i++) {
            for (int j = colIni; j < colIni + 3; j++) {
                if (i != p.fila || j != p.columna) {
                    resultado.add(new Pos(i, j));
                }
            }
        }

        return new ArrayList<>(resultado);
    }

    // ✅ Backtracking usando valores válidos desde 1 a 9
    private boolean backtrack(Tablero tablero) {
        Pos sinAsignar = obtenerNoAsignado(tablero);
        if (sinAsignar == null) return true;

        for (int val = 1; val <= 9; val++) {
            if (esValido(tablero, sinAsignar.fila, sinAsignar.columna, val)) {
                tablero.setCelda(sinAsignar.fila, sinAsignar.columna, val);
                if (backtrack(tablero)) return true;
                tablero.setCelda(sinAsignar.fila, sinAsignar.columna, 0);
            }
        }

        return false;
    }

    // ✅ Busca celda vacía directamente en el tablero (más fiable que mirar dominios)
    private Pos obtenerNoAsignado(Tablero tablero) {
        for (int fila = 0; fila < SIZE; fila++) {
            for (int col = 0; col < SIZE; col++) {
                if (tablero.getCelda(fila, col) == 0) {
                    return new Pos(fila, col);
                }
            }
        }
        return null;
    }

    private boolean esValido(Tablero tablero, int fila, int columna, int valor) {
        for (int i = 0; i < SIZE; i++) {
            if (tablero.getCelda(fila, i) == valor) return false;
            if (tablero.getCelda(i, columna) == valor) return false;
        }

        int fIni = (fila / 3) * 3;
        int cIni = (columna / 3) * 3;
        for (int i = fIni; i < fIni + 3; i++) {
            for (int j = cIni; j < cIni + 3; j++) {
                if (tablero.getCelda(i, j) == valor) return false;
            }
        }

        return true;
    }

    private static class Pair {
        Pos xi, xj;
        Pair(Pos xi, Pos xj) {
            this.xi = xi;
            this.xj = xj;
        }
    }
}
