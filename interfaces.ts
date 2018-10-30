export interface ITradeCenter {
    name?: string;
    shortname?: string;
    askprice?: number;
    bidprice?: number;
    lastprice?: number;
    url?: string;
}
export interface IKoin {
    name: string;
    fullname?: string;
    fav?: boolean;
    exchage: ITradeCenter[];
}

export interface IXurl {
    name: string;
    shortname: string;
    xurl: string;
    xkoinurl: string;
}
