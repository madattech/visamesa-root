 const motive = () => {
      const motivo = document.querySelector('textarea#motivo[name="motivo"][aria-label="motivo"]');                                                                          
                                                                                                                                                                          
   motivo.value = 'Booking appointment to request empadronamiento.';                                                                                                      
                                                                                                                                                                          
   motivo.dispatchEvent(new Event('input', { bubbles: true }));                                                                                                           
   motivo.dispatchEvent(new Event('change', { bubbles: true }));
  
  submit()
 }
const submit = () => {
    document.querySelector('button[type="submit"]').click();
}     

motive();
