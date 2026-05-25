function setField(selector, value) {                                                                                                                                   
     const el = document.querySelector(selector);                                                                                                                         
     if (!el) {                                                                                                                                                           
       console.warn('Not found:', selector);                                                                                                                              
       return false;                                                                                                                                                      
     }                                                                                                                                                                    
                                                                                                                                                                          
     el.value = value;                                                                                                                                                    
     el.dispatchEvent(new Event('input', { bubbles: true }));                                                                                                             
     el.dispatchEvent(new Event('change', { bubbles: true }));                                                                                                            
     el.dispatchEvent(new Event('blur', { bubbles: true }));                                                                                                              
                                                                                                                                                                          
     return true;                                                                                                                                                         
   }   
const submit = () => {
    document.querySelector('button[type="submit"]').click();
}  
const fillInfo = () => {
     setField('select[formcontrolname="identifierType"]', 'PASSAPORT');                                                                                                     
   setField('input[formcontrolname="identifier"]', 'A12345678');                                                                                                          
   setField('input[formcontrolname="name"]', 'John');                                                                                                                     
   setField('input[formcontrolname="surname"]', 'Doe');                                                                                                                   
   setField('input[formcontrolname="secondSurname"]', 'Smith');                                                                                                           
   setField('input[formcontrolname="email"]', 'john.doe@example.com');                                                                                                    
   setField('input[formcontrolname="phone"]', '600123456');   
  submit()
}

fillInfo()
 
