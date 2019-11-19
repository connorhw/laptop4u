'use strict';

const apiKey = '1TGJYsFjOVTW6vG1Qsx2e2i8';
const baseURL = 'https://api.bestbuy.com/v1/products((categoryPath.id=abcat0502000))';
let laptopData;

function getBBLaptops(manuf, maxPrice, storage) {
    const url = 'https://api.bestbuy.com/v1/products(manufacturer='+manuf+'&(categoryPath.id=abcat0502000)&condition=new&regularPrice<='+maxPrice+')'+
    '?apiKey=1TGJYsFjOVTW6vG1Qsx2e2i8&sort=description.asc&show=all&'+
    'pageSize=10&format=json';
    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log('response is good');
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            laptopData = responseJson.products;
            /* pick storage type here */
            
            let storage = "SDD"; //hard coding in value for testing purposes
            var newArray = laptopData.filter(item => item.details["Storage Type"] === storage);
            
            displayResults(newArray);
        });
}

function displayResults(newArray) {
    console.log(newArray);
    $('.bb-laptops-list').empty();
    for (let i=0; i<laptopData.length; i++) { 
        $('.bb-laptops-list').append(
            `<li class="laptop-li" node=${i}>
            <p>${laptopData[i].name}: $${laptopData[i].regularPrice}</p>
            <button type="button" id="select-button">Choose</button>
            <img src="${laptopData[i].thumbnailImage}"></br>
            </li>`
        )
    };
    $('.results').removeClass('hidden');
    displaySelectedLaptopListener();
}

function displaySelectedLaptopListener() {
    $(".laptop-li").click(function() {
        $('.results').addClass('hidden');
        $('.selected').removeClass('hidden');
        let index = $(this).attr('node');
        index = +index; //converts string to number
        getSelectedLaptopInfo(index);
    })

}

function getSelectedLaptopInfo(index){
    $('.bb-selected-laptop').empty();
    console.log(laptopData)
    $(".bb-selected-laptop").append(
    `<img id ="full-laptop-image" src="${laptopData[index].image}" alt="Full image of computer">`
    )
    for (let i=0; i<laptopData[index].features.length; i++) {
        $(".bb-selected-laptop").append(
            `<li>
                ${laptopData[index].features[i].feature}
            </li>`
        )
    }
}

function watchForm() {
    
    $('.form').submit(function(event) {
        event.preventDefault();
        const manuf = $('#js-manuf').val();
        const maxPrice =$('#js-price').val();
        const storage = $('js-storage').val();
        getBBLaptops(manuf, maxPrice, storage);
    });
    
    console.log('On the lookout!');
}

$(function() {
    console.log('App loaded successfully!');
    watchForm();
});