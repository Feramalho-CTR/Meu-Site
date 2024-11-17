const texto = document.querySelector('.apresentacao, h1, p');
const imagem = document.querySelector('.inicio img');


window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const alturaDaPagina = document.body.offsetHeight;
  const posicaoDoTexto = texto.offsetTop;

  if (scrollTop > posicaoDoTexto - alturaDaPagina / 2) {
    texto.classList.add('aparece');
  }
});

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const alturaDaPagina = document.body.offsetHeight;
    const posicaoDaImagem = imagem.offsetTop;
  
    if (scrollTop > posicaoDaImagem - alturaDaPagina / 2) {
      imagem.classList.add('aparece');
    }
  });
 