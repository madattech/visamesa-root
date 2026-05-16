const details = {
    "nie": "Y6950398L",
    "Name": "Girish Sardar",
    "nationality": 88
}

const fillDetails = () => {
    url = "https://icp.administracionelectronica.gob.es/icpplustieb/acEntrada"
    if (url === "https://icp.administracionelectronica.gob.es/icpplustieb/acEntrada"){
        window.document.querySelector("#txtIdCitado").value=details['nie']
        window.document.querySelector("#txtDesCitado").value=details['Name']
        window.document.querySelector("#txtPaisNac").options[details.nationality].selected = true
    }
    window.document.querySelector("#btnEnviar").click()
}
fillDetails();
