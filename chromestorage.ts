class ChromeStoreAPi {

    baseUrl: string;
    baseKeyWord: string;

    constructor() {
        this.baseUrl = "https://koinadda.azurewebsites.net/api/koinadda/";
        this.baseKeyWord = "knsuchna";
    }

    getDataFromKoinAdda = async (what2get: string) => {
        return await $.get(`${this.baseUrl}${what2get}`, (data) => {
            return data;
        }).fail((err) => {
            // uh oh, something went wrong
            console.log(err);
            return undefined;
        });
    }

    saveDateToStore = async (data: any) => {
        await chrome.storage.local.set(data);
    }

    getDataFromStore = async (dataKey: any) => {
        let result: any;
        await new Promise((resolve, reject) => {
            chrome.storage.local.get(dataKey, (data) => {
                if (!$.isEmptyObject(data)) {
                    result = data[dataKey];
                } else {
                    result = undefined;
                }
                resolve();
            });
        });
        return result;
    }
}

export const chromeStoreApi = new ChromeStoreAPi();
