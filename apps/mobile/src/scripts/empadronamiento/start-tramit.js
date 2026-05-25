const url ="https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/ca/tramit/20230001668"
const startTramit = () => {
    const $button = $('button[type="button"][rel="nofollow"]').filter(function () {                                                            
     return $(this).text().trim() === 'Inicia el tràmit';                                                                                     
   }); 
  $button.click()
}
startTramit()
