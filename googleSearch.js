const config = require("./config");
const https = require('https')
const querystring = require('querystring');

/**
 * This function will do the search with google custom search api and return the results
 *
 * @param query
 * @param maxResults
 * @returns {Promise<unknown>}
 */
module.exports = (query, maxResults=5) => {
    // Setup the options for sending the requests
    const query_str = querystring.encode({
        key: config('GOOGLE_API_KEY'),
        cx: config('GOOFLE_SE'),
        q: query
    })
    const options = {
        hostname: 'www.googleapis.com',
        port: 443,
        path: `/customsearch/v1?${query_str}`,
        method: 'GET'
    }

    return new Promise((resolve, reject) => {
        // Create http client
        const req = https.request(options, (res) => {
            let response = '';
            // Check if the status code is 200
            if(res.statusCode === 200){
                // Combine all the data chunks recieved in the data event
                res.on('data', data => {
                    if(data){
                        response += data;
                    }
                })
                // Create the final result when the request is finally over
                res.on('end', (data) => {
                    try{
                        // Parse the result
                        const json_data = JSON.parse(response.toString('utf-8'));
                        const results = []
                        for(let i =0; i < maxResults; i++){
                            const item = json_data.items[i]
                            // Create our own result from the api result
                            results.push({
                                title: item.title,
                                link: item.link,
                                snippet: item.snippet
                            })
                        }
                        resolve(results);
                    }catch(e){
                        reject(new Error('Google search json parse error'));
                    }

                })
            }else{
                reject(new Error("Request not successful"));
            }

        })
        req.on('error', (e) => {
            reject(new Error("Error in request"));
        });
        req.end();
    })
}