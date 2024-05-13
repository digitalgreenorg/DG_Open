const converter = require('json-2-csv')

//Download functionality
export const downloadDocument = (dataToDownload) => { // dataToDownload is the parsed array of object 
    converter.json2csv(dataToDownload, async (err, csv) => {
        if (err) {
            throw err
        }
        // print CSV string
        download(csv)
    })
}
const download = (data) => {
    const blob = new Blob([data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', "Dataset.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
