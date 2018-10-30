import { IKoin, ITradeCenter, IXurl } from "./interfaces";

class Util {
    static allXchangeData: any;
    static favKoins: string[];
    static uniqueKoins: IKoin[];
    static formattedDataForUi: IKoin[];
    static koinNameProps = ["currency_short_form", "marketName", "baseMarket"];
    static xUrls: IXurl[] = [
        { name: "koinex", shortname: "knx", xurl: "https://koinex.in/", xkoinurl: "https://koinex.in/exchange/inr/" },
        // tslint:disable-next-line:max-line-length
        { name: "coindelta", shortname: "cd", xurl: "https://coindelta.com/", xkoinurl: "https://coindelta.com/market/advance/" },
        { name: "wazirx", shortname: "wzrx", xurl: "https://wazirx.com/", xkoinurl: "https://wazirx.com/exchange/" },
        { name: "bitbns", shortname: "btbns", xurl: "https://bitbns.com/", xkoinurl: "https://bitbns.com/trade/#/" },
    ];
    // time diif between two date to call real api
    static diffMinutes = (dt2: Date, dt1: Date) => {
        let diff: number = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    }

    static filterUniqueKoins = (allexchange: any): IKoin[] => {
        const allKoins: IKoin[] = [];
        Object.keys(allexchange).forEach((exchnage) => {
            const koinName = Util.koinNameProps.filter((x) => {
                return Object.keys(allexchange[exchnage][0]).find((k) => k.toUpperCase() === x.toUpperCase());
            })[0];
            allexchange[exchnage].forEach((item: any) => {
                if (!allKoins.find((x) => x.name === item[koinName].toUpperCase())) {
                    const koin: IKoin = {
                        name: item[koinName].split("-")[0].toUpperCase(),
                        fav: false, exchage: [],
                    };
                    allKoins.push(koin);
                }
            });
        });
        return allKoins.sort((a, b) => {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    }

    static arrangeDataForUi = (): IKoin[] => {
        const allKoinsData: IKoin[] = [];
        const favKoins = utility.favKoins;
        const data = utility.allXchangeData;
        utility.uniqueKoins.forEach((k) => {
            // logic
            const koin: IKoin = { name: k.name, fullname: "NA", exchage: [] };
            koin.fav = favKoins.find((x) => x === k.name.toUpperCase()) === undefined ? false : true;
            Object.keys(data).forEach((ex) => {
                const exchange: ITradeCenter = { lastprice: 0, name: ex.substring(0, 2), url: "https://google.com" };
                // find if koin name property
                const koinNameProp = Util.koinNameProps.filter((x) => {
                    return Object.keys(data[ex][0]).find((kx) => kx.toUpperCase() === x.toUpperCase());
                })[0];
                // find if koin last like prop is avilabel
                const koinLastPricProp = Object.keys(data[ex][0]).filter((x) => {
                    return x.toLowerCase().startsWith("last");
                })[0];
                // find if koin is avilabel in exchange
                const koinInxchange: any = data[ex].find((item: any) =>
                    item[koinNameProp].split("-")[0].toUpperCase() === k.name.toUpperCase());
                // find xchange url and name;
                const xUrl = utility.xUrls.find((x) => x.name === ex.toLowerCase());
                exchange.name = xUrl.name;
                exchange.shortname = xUrl.shortname;
                exchange.url = xUrl.xurl;

                if (koinInxchange !== undefined) {
                    koin.fullname = koinInxchange[koinNameProp];
                    exchange.lastprice = Number.parseFloat(koinInxchange[koinLastPricProp]);

                    switch (ex.toUpperCase()) {
                        case "KOINEX":
                            exchange.url = `${xUrl.xkoinurl}${koinInxchange.currency_full_form}`;
                            break;
                        case "COINDELTA":
                            exchange.url = `${xUrl.xkoinurl}${koinInxchange[koinNameProp]}`;
                            break;
                        case "BITBNS":
                            exchange.url = `${xUrl.xkoinurl}${koin.name.toLowerCase()}`;
                            break;
                        case "WAZIRX":
                            exchange.url = `${xUrl.xkoinurl}${k.name.toUpperCase()}-INR`;
                            break;
                        default:
                            break;
                    }
                }
                koin.exchage.push(exchange);
            });
            allKoinsData.push(koin);

        });
        return allKoinsData;
    }

    static clone = (data: any): any => {
        return JSON.parse(JSON.stringify(data));
    }
}
export const utility = Util;
