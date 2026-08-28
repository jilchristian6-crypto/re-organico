from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

insert = '''
                            <div class="hero-diapositiva" data-hero-diapositiva aria-hidden="true">
                                <img src="img/productos/actualizadas/bolsa-48x55-my22.webp" alt="Bolsas compostables Re Orgánico en uso" style="--posicion-foto: center 50%;" loading="lazy">
                            </div>
                            <div class="hero-diapositiva" data-hero-diapositiva aria-hidden="true">
                                <img src="img/productos/cambios-20260821/contenedor-pla-250.webp" alt="Contenedor compostable Re Orgánico con fruta" style="--posicion-foto: center 50%;" loading="lazy">
                            </div>'''

needle = '''                            <div class="hero-diapositiva" data-hero-diapositiva aria-hidden="true">
                                <img src="img/hero-carrusel/07-ruta-reorganico.webp" alt="Recorrido de Re Orgánico por el campo" style="--posicion-foto: center 45%;" loading="lazy">
                            </div>'''

if 'img/productos/actualizadas/bolsa-48x55-my22.webp' not in s:
    s = s.replace(needle, needle + insert)
    s = s.replace('''                            <button class="hero-carrusel-indicador" type="button" data-hero-indice="6" aria-label="Ver foto 7" aria-current="false"></button>''', '''                            <button class="hero-carrusel-indicador" type="button" data-hero-indice="6" aria-label="Ver foto 7" aria-current="false"></button>\n                            <button class="hero-carrusel-indicador" type="button" data-hero-indice="7" aria-label="Ver foto 8" aria-current="false"></button>\n                            <button class="hero-carrusel-indicador" type="button" data-hero-indice="8" aria-label="Ver foto 9" aria-current="false"></button>''')
    s = s.replace('Foto 1 de 7', 'Foto 1 de 9')

p.write_text(s, encoding='utf-8')
