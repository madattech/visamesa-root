const switchFunc = () => {
  const currentUrl = window.location.href;
  if (
    currentUrl ===
    "https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus"
  ) {
    window.document.querySelector("#submit").click();
  }
};
switchFunc();
