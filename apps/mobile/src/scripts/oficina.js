const oficina = () => {
    const url  = "https://icp.administracionelectronica.gob.es/icpplustieb/citar?p=8&locale=es"
    if (url=== "https://icp.administracionelectronica.gob.es/icpplustieb/citar?p=8&locale=es") {
        const tramites = window.document.querySelector("#tramiteGrupo\\[0\\]").options[17].selected = true;
    }
    document.querySelector("#btnAceptar").click()
}

oficina();
