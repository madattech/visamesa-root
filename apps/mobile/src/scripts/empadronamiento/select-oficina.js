const submit = () => {
    document.querySelector('button[type="submit"]').click();
}
const selectOffice= () => {
    document.querySelector('#OAC-DR')?.click();
    submit()
}

selectOffice()
