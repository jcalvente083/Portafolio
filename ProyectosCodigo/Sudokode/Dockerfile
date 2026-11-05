FROM kasmweb/core-ubuntu-focal:1.15.0

USER root

# 1. INSTALACIÓN
# Añadimos 'wmctrl': Herramienta para controlar ventanas por comando.
# Añadimos 'openbox' y 'x11-xserver-utils': Necesarios para el entorno gráfico básico.
RUN apt-get update && \
    apt-get install -y openjdk-17-jre libxext6 libxrender1 libxtst6 libxi6 fontconfig openbox x11-xserver-utils wmctrl && \
    rm -rf /var/lib/apt/lists/*

# 2. APP
WORKDIR /app
COPY sudokode.jar /app/sudoku.jar
RUN chown -R 1000:1000 /app

# 3. SCRIPT DE INICIO INTELIGENTE
# Aquí está la magia:
# a. Ponemos fondo negro.
# b. Lanzamos el Sudoku en segundo plano (&).
# c. Esperamos 5 segundos a que Java arranque (Java es lento).
# d. Usamos 'wmctrl' para buscar la ventana activa y ponerla en FULLSCREEN.
RUN echo "#!/bin/bash" > /dockerstartup/custom_startup.sh && \
    echo "xsetroot -solid black &" >> /dockerstartup/custom_startup.sh && \
    echo "java -jar /app/sudoku.jar &" >> /dockerstartup/custom_startup.sh && \
    echo "sleep 5 && wmctrl -r :ACTIVE: -b add,fullscreen" >> /dockerstartup/custom_startup.sh && \
    chmod +x /dockerstartup/custom_startup.sh

USER 1000
