FROM kasmweb/core-ubuntu-focal:1.15.0

USER root

# 1. Instalamos todas las dependencias
RUN apt-get update && \
    apt-get install -y openjdk-17-jre libxext6 libxrender1 libxtst6 libxi6 fontconfig openbox x11-xserver-utils wmctrl && \
    rm -rf /var/lib/apt/lists/*

# 2. Configuración Openbox (Línea restaurada por completo)
RUN sed -i 's|</applications>|  <application class="*"><decorations>no</decorations><maximized>yes</maximized></application>\n</applications>|' /etc/xdg/openbox/rc.xml

# 3. Directorio de trabajo
WORKDIR /app

# 4. COPIAMOS LOS ARCHIVOS Y CARPETAS
# Asumo que tu archivo local se llama gvgenius.jar. Si no, cámbialo en la primera parte.
COPY gvgenius.jar /app/gvgenius.jar

# Copiamos las carpetas enteras al contenedor
COPY examples/ /app/examples/
COPY sprites/ /app/sprites/

# Damos permisos a todo lo que hay dentro de /app para que Java pueda leer/escribir
RUN chown -R 1000:1000 /app

# 5. Script de inicio
# Novedad clave: lanzamos gvgenius.jar (el nombre exacto que le pusimos en el paso 4)
RUN echo "#!/bin/bash" > /dockerstartup/custom_startup.sh && \
    echo "xsetroot -solid black &" >> /dockerstartup/custom_startup.sh && \
    echo "cd /app && java -jar gvgenius.jar &" >> /dockerstartup/custom_startup.sh && \
    echo "sleep 5 && wmctrl -r :ACTIVE: -b add,fullscreen" >> /dockerstartup/custom_startup.sh && \
    chmod +x /dockerstartup/custom_startup.sh

USER 1000
