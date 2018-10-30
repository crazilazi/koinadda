import { chromeStoreApi } from "./chromestorage";
import { IKoin, ITradeCenter } from "./interfaces";
import { classes } from "./stringconst";
import { utility } from "./util";
$(() => {
    // prepare data to make ui
    const dataInitialization: any = async () => {
        utility.allXchangeData = await chromeStoreApi.getDataFromKoinAdda("GetAllKoin");
        utility.favKoins = await chromeStoreApi.getDataFromStore("koinaddafav");
        utility.uniqueKoins = utility.filterUniqueKoins(utility.allXchangeData);
        utility.formattedDataForUi = utility.arrangeDataForUi();
        return utility.clone(utility.formattedDataForUi);
    };

    const wakeMeUp: any = async () => {
        $("body").jWaitIndicatorStart({ waitIndicatorImage: "../icon/moon.svg" });
        visualizeMe(await dataInitialization());
        $("body").jWaitIndicatorDestroy();
    };

    const visualizeMe = (koins: IKoin[]) => {
        $("#maincontainer").empty();
        const noOfCols: number = 3;
        const rows: number = Math.ceil(koins.length / (12 / noOfCols));
        for (let index: number = 1; index <= rows; index++) {
            const col: any[] = [];
            for (let i: number = 0; i < (12 / noOfCols); i++) {
                // your code
                if (koins[i] === undefined) {
                    break;
                }
                const crpto: IKoin = koins[i];
                col.push($("<div>",
                    { class: `col-sm-${noOfCols} col-md-${noOfCols} col-lg-${noOfCols} col-xl-${noOfCols}` })
                    .append(
                        $("<div>", { class: "card" }).append(
                            $("<h5>", { class: "card-header", style: "cursor: pointer" })
                                .append(
                                    (crpto.fav ? $("<img>",
                                        {
                                            src: "./icon/fav.svg",
                                            alt: "icon name", class: "favicon float-right",
                                        }) : ""),
                                )
                                .append($("<div>", { class: "float-left" })
                                    .append($("<span>", { text: "$" }))
                                    .append($("<span>", { text: crpto.name, class: "text" })),
                                ),
                        ).append(
                            $("<div>", { class: "card-body" }).append(
                                $("<h5>", { class: "card-title", text: "Exchange Prices" }),
                            ).append(
                                $("<div>", { class: "table-responsive" })
                                    .append(
                                        $("<table>", { class: "table" })
                                            .append($("<thead>")
                                                .append($("<tr>")
                                                    .append(
                                                        // append header here
                                                        crpto.exchage.map((item) => {
                                                            return $("<th>", { text: item.shortname });
                                                        }),
                                                    ),
                                                ),
                                            )
                                            .append($("<tbody>")
                                                .append($("<tr>")
                                                    .append(
                                                        // append body here
                                                        crpto.exchage.map((item) => {
                                                            return $("<td>")
                                                                .append($("<a>", {
                                                                    text: item.lastprice + "₹",
                                                                    target: "_blank", href: item.url,
                                                                }));
                                                        }),
                                                    ),
                                                ),
                                            ),
                                    ),
                            ).addClass(classes[Math.floor(Math.random() * classes.length)]),
                        ),
                    ));
            }
            // add cols to row
            $("<div>", { class: "row" }).append(col).appendTo("#maincontainer");
            for (let i: number = 0; i < (12 / noOfCols); i++) {
                koins.shift();
            }
        }
        chooseFavs();
    };

    const tabulizeMe = (koins: IKoin[]) => {
        // code
        $("#maincontainer").empty();
        const tableContainer = $("<div>", { class: "table-responsive" });
        tableContainer.append(
            $("<table>", { class: "table table-dark", id: "tabular" })
                .append($("<thead>")
                    .append($("<tr>")
                        .append($("<th>", { text: "" }))
                        .append(
                            // append header here
                            koins[0].exchage.map((item) => {
                                return $("<th>", { text: item.name });
                            }),
                        ),
                    ),
                )
                .append($("<tbody>", { id: "tabulartbody" })),
        );
        const tabulartbody = tableContainer.find("#tabulartbody");
        koins.forEach((ko) => {
            // logic
            const tds = [$("<td>", { text: ko.name })];
            ko.exchage.forEach((xchange) => {
                tds.push($("<td>", { text: xchange.lastprice }));
            });
            tabulartbody.append($("<tr>")
                .append(tds));
        });
        $("#maincontainer").append(tableContainer);
    };
    const navintraction = () => {
        // your code
        // ui interation events
        $("#reload").on("click", async () => {
            // $("#fav").removeClass("active");
            $("#searchtext").val("");
            $("body").jWaitIndicatorStart({ waitIndicatorImage: "../icon/moon.svg" });
            let data = await dataInitialization();
            if ($("#fav").hasClass("active")) {
                const favKoins: string[] = utility.favKoins;
                data = data.filter((x) => favKoins.find((k) => k === x.name.toUpperCase()));
            }
            if ($("#tabulardata").hasClass("active")) {
                tabulizeMe(data);
            } else {
                visualizeMe(data);
            }
            $("body").jWaitIndicatorDestroy();
        });
        // search koins
        $("#searchtext").on("keyup", async (event) => {
            // your code
            const text: string = ($(event.target).val() as string).toUpperCase().trim();
            let koins = utility.clone(utility.formattedDataForUi);
            if ($("#fav").hasClass("active")) {
                const favKoins: string[] = utility.favKoins;
                koins = koins.filter((x) => favKoins.find((k) => k === x.name.toUpperCase()));
            }
            if ($("#tabulardata").hasClass("active")) {
                tabulizeMe(koins.filter((x) => x.name.toUpperCase().startsWith(text)));
            } else {
                visualizeMe(koins.filter((x) => x.name.toUpperCase().startsWith(text)));
            }
        });
        // get all fav koins
        $("#fav").on("click", async (event) => {
            // your code
            let koins = utility.clone(utility.formattedDataForUi);
            const searchtext: string = ($("#searchtext").val() as string).toUpperCase().trim();
            if (searchtext !== "") {
                koins = koins.filter((x) => x.name.toUpperCase().startsWith(searchtext));
            }
            if (!$("#fav").hasClass("active")) {
                $("#fav").addClass("active");
                const favKoins: string[] = utility.favKoins;
                koins = koins.filter((x) => favKoins.find((k) => k === x.name.toUpperCase()));
            } else {
                $("#fav").removeClass("active");
            }
            if ($("#tabulardata").hasClass("active")) {
                tabulizeMe(koins);
            } else {
                visualizeMe(koins);
            }
        });

        $("#tabulardata").on("click", async (event) => {
            // your code
            let koins = utility.clone(utility.formattedDataForUi);
            const searchtext: string = ($("#searchtext").val() as string).toUpperCase().trim();
            if (searchtext !== "") {
                koins = koins.filter((x) => x.name.toUpperCase().startsWith(searchtext));
            }
            if ($("#fav").hasClass("active")) {
                const favKoins: string[] = utility.favKoins;
                koins = koins.filter((x) => favKoins.find((k) => k === x.name.toUpperCase()));
            }
            if (!$("#tabulardata").hasClass("active")) {
                $("#tabulardata").addClass("active");
                tabulizeMe(koins);
            } else {
                $("#tabulardata").removeClass("active");
                visualizeMe(koins);
            }

        });
    };
    // make fav koins
    // tslint:disable-next-line:typedef
    function chooseFavs() {
        $(".card-header").on("click", async (event) => {
            console.log(event);
            const favKoins = utility.favKoins;
            const text: string = ($(event.currentTarget).find(".text").text() as string).toUpperCase().trim();
            if (!favKoins.find((x) => x === text)) {
                favKoins.push(text);
                $(event.currentTarget).append(
                    $("<img>", { src: "./icon/fav.svg", alt: "icon name", class: "favicon float-right" }),
                );
            } else {
                const index: number = favKoins.findIndex(((x) => x === text));
                favKoins.splice(index, 1);
                $(event.currentTarget).find(".favicon").remove();
            }
            chromeStoreApi.saveDateToStore({ koinaddafav: utility.favKoins });
        });
    }

    // modal magic
    $("#cryptoModal").modal("show");
    $("#yesModal").on("click", () => {
        $("#cryptoModal").modal("hide");
        $("#navbar").show();
        navintraction();
        wakeMeUp();
    });
    $("#noModal").on("click", () => {
        $("#cryptoModal").modal("hide");
        $("#navbar").hide();
        // $("body").addClass(classes[Math.floor(Math.random() * classes.length)])
        $("body").append(
            $("<canvas>"),
        );
        bouncingball.initBouncingBall();
    });
});
