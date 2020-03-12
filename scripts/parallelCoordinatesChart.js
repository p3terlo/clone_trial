const AdvantageAPIkey = "1CM19T0YJXP6L6RL";
const FinnhubAPIkey = "bpkhng7rh5rcgrlrac8g";
const IEXCloudkey = "pk_082890e2408448e6a98d6eb27d0d86be"

function parallelCoordinatesChart(svg, companies) { 
	for (let i=0;i<companies.length;i++){
		try { 
			//'batch?types=quote,news,chart&range=1m&last=10'
			d3.json('https://cloud.iexapis.com/stable/stock/' + companies[i] + '/book?token=pk_082890e2408448e6a98d6eb27d0d86be', function(data) {
				console.log('data ' + data)
				console.log(data)
			})
		} catch (e) {
			console.log(e)
		}
	}

	return;
}
