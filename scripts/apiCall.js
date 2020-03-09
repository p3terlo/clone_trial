function makeApiCall(callbackfunc) {
    const url = 'https://finnhub.io/api/v1/stock/symbol?exchange=US&token=' + FINNHUB_API_KEY;
    let request = new Request(url)
    
    fetch(request)
        .then((response) => {
            if(response.status === 200) {
				return response.json();
			} else {
				throw new Error('Something went wrong on API server');
			}
        })
        .then(function(data){
            console.log('apiData = ', data);
            let companyProfile = data;

            doStuffWithData(companyProfile);
        })
}

function doStuffWithData(data) {
    console.log('in doStuffWithData');
}

makeApiCall(doStuffWithData);