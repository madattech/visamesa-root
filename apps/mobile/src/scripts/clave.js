const clave = () => {
    const url = "https://icp.administracionelectronica.gob.es/icpplustieb/"
    if (url.includes("icpplustieb")) {
        console.log("URL true")
        const sinClave = window.document.querySelector('#btnEntrar').click();
    }
}
clave();
