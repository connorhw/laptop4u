'use strict';

const apiKey = '1TGJYsFjOVTW6vG1Qsx2e2i8';
const baseURL = 'https://api.bestbuy.com/v1/products((categoryPath.id=abcat0502000))';

function getLaptops() {
    const url = 'https://api.bestbuy.com/v1/products((categoryPath.id=abcat0502000))?apiKey=1TGJYsFjOVTW6vG1Qsx2e2i8&sort=description.asc&show=categoryPath.id,categoryPath.name,description,details.name,features.feature,manufacturer,name,regularPrice,thumbnailImage&format=json';
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
}

function watchForm() {
    console.log('On the lookout!');
    getLaptops();
}

$(function() {
    console.log('App loaded successfully!');
    watchForm();
});