'use strict';

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
                      return x.name === "Storage Type" 
                       })
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

    const apiKey = 'AIzaSyDFqlW_ceO8-lJmkHtM7SspmiY19gZm9sU'; 
    const searchURL = 'https://www.googleapis.com/youtube/v3/search';
    const query = laptopData[index].modelNumber;
    
    function formatQueryParams(params) {
        const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
    }

    function getYouTubeVideos(query, maxResults) {
        console.log(query);
    const params = {
        key: apiKey,
        q: query,
        part: 'snippet',
        type: 'video',
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
        .then(responseJson => {
            var vidId = responseJson.items[0].id.videoId;
            console.log("//www.youtube.com/embed/${vidId}")
            $('.youtube-vid').empty();
            $('.youtube-vid').append(`
            <iframe src="https://www.youtube.com/embed/${vidId}" height="200" width="300"></iframe>
            `) 
        })
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