'use strict';

const apiKey = '1TGJYsFjOVTW6vG1Qsx2e2i8';
const baseURL = 'https://api.bestbuy.com/v1/products((categoryPath.id=abcat0502000))';

function getBBLaptops(manuf) {
    /*
    const params = {
        manufacturer: manuf
    };
    */
    const url = 'https://api.bestbuy.com/v1/products(manufacturer='+manuf+'&(categoryPath.id=abcat0502000))?apiKey=1TGJYsFjOVTW6vG1Qsx2e2i8&sort=description.asc&show=categoryPath.id,categoryPath.name,description,details.name,features.feature,manufacturer,name,regularPrice,thumbnailImage&format=json';
    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log('we gucci...response ok');
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
}

function displayResults(responseJson) {
    console.log(responseJson);
    $('.bb-laptops-list').empty();
    for (let i=0; i<responseJson.products.length; i++) {
        $('.bb-laptops-list').append(
            `<li>
            <p>${responseJson.products[i].name}</p>
            <div>${responseJson.products[i].manufacturer}</div>
            </li>`
        )
    };
    $('.results').removeClass('hidden');
}

function watchForm() {
    
    $('.form').submit(function(event) {
        event.preventDefault();
       const manuf = $('#js-manuf').val();

        getBBLaptops(manuf);
    });
    
    console.log('On the lookout!');
    
}

$(function() {
    console.log('App loaded successfully!');
    watchForm();
});