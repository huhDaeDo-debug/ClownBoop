(function() {
    'use strict';

    var boton = document.getElementById('boton-bocina');
    var audio = document.getElementById('audio-bocina');
    var ultimoToque = 0;

    // Función principal: reproducir sonido y vibrar
    function activarBocina() {
        var ahora = Date.now();
        // Evita el doble evento 'keydown' que algunos dispositivos KaiOS envían con la tecla OK
        if (ahora - ultimoToque < 150) {
            return; 
        }
        ultimoToque = ahora;

        // 1. Vibración (si el hardware lo permite)
        if (navigator.vibrate) {
            navigator.vibrate(60);
        }

        // 2. Reproducción de audio
        try {
            // Si ya se está reproduciendo, lo reiniciamos para un efecto de "disparo" inmediato
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }
            // play() devuelve una promesa en navegadores modernos, pero en Firefox 48 puede ser void.
            // Lo manejamos de forma segura.
            var promesa = audio.play();
            if (promesa !== undefined) {
                promesa.catch(function(error) {
                    console.log("Error al reproducir audio:", error);
                });
            }
        } catch (e) {
            console.log("Excepción al reproducir:", e);
        }
    }

    // 3. Escuchar el teclado físico (KaiOS usa 'Enter' para el botón central OK)
    document.addEventListener('keydown', function(evento) {
        // Código 13 es 'Enter'
        if (evento.key === 'Enter' || evento.keyCode === 13) {
            evento.preventDefault(); // Evita comportamientos por defecto del navegador
            activarBocina();
        }
    });

    // 4. Escuchar clics (para probar en el emulador de escritorio o si hay pantalla táctil)
    boton.addEventListener('click', function(evento) {
        evento.preventDefault();
        activarBocina();
    });

    // 5. Asegurar que el botón tenga el foco al iniciar
    window.addEventListener('load', function() {
        boton.focus();
    });

})();
