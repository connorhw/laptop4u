'use strict';

const apiKey = '1TGJYsFjOVTW6vG1Qsx2e2i8';
const baseURL = 'https://api.bestbuy.com/v1/products((categoryPath.id=abcat0502000))';
let laptopData;

function getBBLaptops(manuf, maxPrice) {
    const url = 'https://api.bestbuy.com/v1/products(manufacturer='+manuf+'&(categoryPath.id=abcat0502000)&condition=new&regularPrice<='+maxPrice+')?apiKey=1TGJYsFjOVTW6vG1Qsx2e2i8&'+
    'sort=description.asc&show=categoryPath.id,categoryPath.name,description,details.name,features.feature,manufacturer,name,regularPrice,thumbnailImage&'+
    'pageSize=25&format=json';
    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log('response is good');
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            laptopData = responseJson;
            displayResults(responseJson);
        });
}

function displayResults(responseJson) {
    console.log(laptopData);
    $('.bb-laptops-list').empty();
    for (let i=0; i<responseJson.products.length; i++) {
        $('.bb-laptops-list').append(
            `<li class="laptop-li" node=${i}>
            <p>${responseJson.products[i].name}: $${responseJson.products[i].regularPrice}</p>
            <button type="button" id="select-button">test next</button>
            <img src="${responseJson.products[i].thumbnailImage}"></br>
            </li>`
        )
    };
    $('.results').removeClass('hidden');
    displaySelectedLaptopListener();
}

function displaySelectedLaptopListener() {
    //console.log(laptopData);
    $(".laptop-li").click(function() {
        $('.results').addClass('hidden');
        $('.selected').removeClass('hidden');
        let index = $(this).attr('node');
        console.log(index);
        index = +index; //converts string to number
        console.log(index);
    })

    
    /*
    $('.bb-selected-laptop').append(`<li>
        <p>${laptopData.products[4].name}</p>
    </li>`)
    */
}

/*
function getSelectedLaptopInfo(){
        console.log($(this));
    let index = $(this).attr('node');
        console.log(index);
        index = +index; //converts string to number
        console.log(index);
}
*/
function watchForm() {
    
    $('.form').submit(function(event) {
        event.preventDefault();
        const manuf = $('#js-manuf').val();
        const maxPrice =$('#js-price').val();
        getBBLaptops(manuf, maxPrice);
    });
    
    console.log('On the lookout!');
}

$(function() {
    console.log('App loaded successfully!');
    watchForm();
});