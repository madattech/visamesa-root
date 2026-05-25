const homeUrl = "https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/ca"
const selector = 'a[href*="/oficinavirtual/ca/search-result"][href*="idCategory=21"]'
const startProcess = () => {
    window.document.querySelector(selector).click()
};
startProcess()
