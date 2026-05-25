const url = "https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/ca/search-result?idCategory=21"
const selectOAC = () => {
    const $item = $('p').filter((_, el) =>                                                                                                     
      $(el).text().trim() === "Cita amb les Oficines d'Atenció Ciutadana"                                                                      
   );
  $item.click()   
};
selectOAC()
