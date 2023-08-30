//Get the name of the select user

let usrName = new URLSearchParams(window.location.search).get('name')

fetch(`/api/images?name=${usrName}`)
.then(res => res.json())
.then(json => {
    console.log(json)
})
