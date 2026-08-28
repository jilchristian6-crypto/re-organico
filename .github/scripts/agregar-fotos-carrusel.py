from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')
s = s.replace('img/hero-carrusel/08-bolsas-compostables.webp', 'img/hero-carrusel/08-bolsas-compostables.jpg')
s = s.replace('img/hero-carrusel/09-contenedor-fruta.webp', 'img/hero-carrusel/09-contenedor-fruta.jpg')
p.write_text(s, encoding='utf-8')
