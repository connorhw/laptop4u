'use strict';

//const apiKey = '1TGJYsFjOVTW6vG1Qsx2e2i8';
//const baseURL = 'https://api.bestbuy.com/v1/products((categoryPath.id=abcat0502000))';
let laptopData;

function getBBLaptops(manuf, maxPrice, storage) {
    const url = 'https://api.bestbuy.com/v1/products(manufacturer='+manuf+'&(categoryPath.id=abcat0502000)&condition=new&regularPrice<='+maxPrice+')'+
    '?apiKey=1TGJYsFjOVTW6vG1Qsx2e2i8&sort=description.asc&show=all&'+
    'pageSize=100&format=json';
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            laptopData = responseJson.products;
            var newArray = laptopData.filter(item => { 
                let myItem = item.details.find(x => {
                    //console.log(x.name);
                      return x.name === "Storage Type" 
                       })
                //return myItem.value === storage
                return myItem && myItem.value === storage
                });//filters storage type
            displayResults(newArray);
        });
}

function displayResults(newArray) {
    console.log(newArray);
    $('.bb-laptops-list').empty();
    for (let i=0; i<newArray.length; i++) { 
        $('.bb-laptops-list').append(
            `<li class="laptop-li" node=${i}>
            <p>${newArray[i].name}: $${newArray[i].regularPrice}</p>
            <button type="button" id="select-button">Choose</button>
            <img src="${newArray[i].thumbnailImage}"></br>
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
    //start of 2nd API request

    const apiKey = 'AIzaSyDKeYmRQHA0Z1oGKjC01kQhrqB3Zg6k48Y'; 
    const searchURL = 'https://www.googleapis.com/youtube/v3/search';
    const query = laptopData[index].modelNumber;
    console.log(query);

    
    function formatQueryParams(params) {
        const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
    }


    function getYouTubeVideos(query, maxResults) {
    const params = {
        key: apiKey,
        q: query,
        part: 'snippet',
        maxResults
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    fetch(url)
        .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
        })
        .then(responseJson => console.log(JSON.stringify(responseJson)))
        .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
    }
    let maxResults = 1;
    getYouTubeVideos(query, maxResults)
    
} 
//end of Second API request

function watchForm() {
    $('.form').submit(function(event) {
        event.preventDefault();
        const manuf = $('#js-manuf').val();
        const maxPrice =$('#js-price').val();
        const storage = $('#js-storage').val();
        getBBLaptops(manuf, maxPrice, storage);
    });
}

$(function() {
    watchForm();
});