angular.module('labControlApp')
    .service('plotService', [

        function() {
            this.monitorLayout = function(title) {
                return {
                    "hidesources": true,
                    "autosize": true,
                    "dragmode": "zoom",
                    "yaxis": {
                        "showexponent": "none",
                        "showticklabels": true,
                        "titlefont": {
                            "color": "rgb(255, 255, 255)",
                            "family": "\"Open Sans\", verdana, arial, sans-serif",
                            "size": 36
                        },
                        "linecolor": "rgb(255, 255, 255)",
                        "mirror": "ticks",
                        "nticks": 0,
                        "rangemode": "normal",
                        "autorange": true,
                        "linewidth": 1,
                        "tickmode": "auto",
                        // "title": "Temperature (K)",
                        "ticks": "",
                        "showgrid": true,
                        "zeroline": false,
                        "gridcolor": "rgba(217, 217, 217, 100)",
                        "type": "linear",
                        "ticklen": 5,
                        "showline": true,
                        "tickfont": {
                            "color": "rgb(255, 255, 255)",
                            "family": "-apple-system, \"Open Sans\", verdana, arial, sans-serif",
                            "size": 16
                        },
                        "tickwidth": 1,
                        "tickangle": "auto",
                        "gridwidth": 0.1,
                        "range": [2.7809, 5.3529],
                        "tickcolor": "rgb(255, 255, 255)",
                        "exponentformat": "B"
                    },
                    "paper_bgcolor": "rgb(67, 67, 67)",
                    "plot_bgcolor": "rgba(0, 0, 0, 0)",
                    "title": title,
                    "separators": ".,",
                    // "height": 300,
                    // "width": 800,
                    "titlefont": {
                        "color": "rgb(255, 255, 255)",
                        "family": "-apple-system, \"Open Sans\", verdana, arial, sans-serif",
                        "size": 24
                    },
                    "xaxis": {
                        "showexponent": "none",
                        "showticklabels": true,
                        // "titlefont": { "color": "rgb(255, 255, 255)", "family": "\"Open Sans\", verdana, arial, sans-serif", "size": 36 },
                        "linecolor": "rgb(255, 255, 255)",
                        "mirror": "ticks",
                        "nticks": 0,
                        "rangemode": "normal",
                        "autorange": true,
                        "linewidth": 1,
                        "tickmode": "auto",
                        // "title": "Time",
                        "ticks": "",
                        "showgrid": true,
                        "zeroline": false,
                        "gridcolor": "rgb(217, 217, 217)",
                        "type": "date",
                        "ticklen": 5,
                        "showline": true,
                        "tickfont": {
                            "color": "rgb(255, 255, 255)",
                            "family": "\"Open Sans\", verdana, arial, sans-serif",
                            "size": 12
                        },
                        "tickwidth": 1,
                        "tickangle": "auto",
                        "gridwidth": 0.1,
                        // "range": [1459859402000, 1459870802000],
                        "tickcolor": "rgb(255, 255, 255)",
                        "exponentformat": "B"
                    },
                    "hovermode": "x",
                    "font": {
                        "color": "rgb(255, 255, 255)",
                        "family": "-apple-system, \"Open Sans\", verdana, arial, sans-serif",
                        "size": 12
                    },
                    "legend": {
                        "font": {
                            "size": 16
                        }
                    },
                    "showlegend": false,
                    margin: {
                        t: 60,
                        autoexpand: true,
                        pad: 0,
                        l: 60,
                        r: 40,
                        b: 40
                    }
                };
            }

            this.monitorTrace = function(title) {
                return {
                    x: [],
                    y: [],
                    mode: 'lines',
                    name: title,
                    delta: null,
                    temp: null,
                    line: {
                        color: '#66D9EF',
                        width: 2
                    },
                    layout: {
                        "hidesources": true,
                        "autosize": true,
                        "dragmode": "zoom",
                        "yaxis": {
                            "showexponent": "none",
                            "showticklabels": true,
                            "titlefont": {
                                "color": "rgb(255, 255, 255)",
                                "family": "\"Open Sans\", verdana, arial, sans-serif",
                                "size": 36
                            },
                            "linecolor": "rgb(255, 255, 255)",
                            "mirror": "ticks",
                            "nticks": 0,
                            "rangemode": "normal",
                            "autorange": true,
                            "linewidth": 1,
                            "tickmode": "auto",
                            // "title": "Temperature (K)",
                            "ticks": "",
                            "showgrid": true,
                            "zeroline": false,
                            "gridcolor": "rgba(217, 217, 217, 100)",
                            "type": "linear",
                            "ticklen": 5,
                            "showline": true,
                            "tickfont": {
                                "color": "rgb(255, 255, 255)",
                                "family": "-apple-system, \"Open Sans\", verdana, arial, sans-serif",
                                "size": 16
                            },
                            "tickwidth": 1,
                            "tickangle": "auto",
                            "gridwidth": 0.1,
                            "range": [2.7809, 5.3529],
                            "tickcolor": "rgb(255, 255, 255)",
                            "exponentformat": "B"
                        },
                        "paper_bgcolor": "rgb(67, 67, 67)",
                        "plot_bgcolor": "rgba(0, 0, 0, 0)",
                        "title": title,
                        "separators": ".,",
                        // "height": 300,
                        // "width": 800,
                        "titlefont": {
                            "color": "rgb(255, 255, 255)",
                            "family": "-apple-system, \"Open Sans\", verdana, arial, sans-serif",
                            "size": 24
                        },
                        "xaxis": {
                            "showexponent": "none",
                            "showticklabels": true,
                            // "titlefont": { "color": "rgb(255, 255, 255)", "family": "\"Open Sans\", verdana, arial, sans-serif", "size": 36 },
                            "linecolor": "rgb(255, 255, 255)",
                            "mirror": "ticks",
                            "nticks": 0,
                            "rangemode": "normal",
                            "autorange": true,
                            "linewidth": 1,
                            "tickmode": "auto",
                            // "title": "Time",
                            "ticks": "",
                            "showgrid": true,
                            "zeroline": false,
                            "gridcolor": "rgb(217, 217, 217)",
                            "type": "date",
                            "ticklen": 5,
                            "showline": true,
                            "tickfont": {
                                "color": "rgb(255, 255, 255)",
                                "family": "\"Open Sans\", verdana, arial, sans-serif",
                                "size": 12
                            },
                            "tickwidth": 1,
                            "tickangle": "auto",
                            "gridwidth": 0.1,
                            // "range": [1459859402000, 1459870802000],
                            "tickcolor": "rgb(255, 255, 255)",
                            "exponentformat": "B"
                        },
                        "hovermode": "x",
                        "font": {
                            "color": "rgb(255, 255, 255)",
                            "family": "-apple-system, \"Open Sans\", verdana, arial, sans-serif",
                            "size": 12
                        },
                        "legend": {
                            "font": {
                                "size": 16
                            }
                        },
                        "showlegend": false,
                        margin: {
                            t: 60,
                            autoexpand: true,
                            pad: 0,
                            l: 60,
                            r: 40,
                            b: 40
                        }
                    }
                }
            }

            this.magnetLayout = function() {
                return {
                    "hidesources": false,
                    "autosize": true,
                    "dragmode": "zoom",
                    "yaxis": {
                        "showexponent": "none",
                        "showticklabels": true,
                        "titlefont": {
                            "color": "rgb(255, 255, 255)",
                            "family": "\"Open Sans\", verdana, arial, sans-serif",
                            "size": 18
                        },
                        "linecolor": "rgb(255, 255, 255)",
                        "mirror": "ticks",
                        "nticks": 0,
                        "rangemode": "normal",
                        "autorange": true,
                        "linewidth": 1,
                        "tickmode": "auto",
                        "title": "Voltage (mV)",
                        "ticks": "",
                        "showgrid": true,
                        "zeroline": false,
                        "gridcolor": "rgb(217, 217, 217)",
                        "type": "linear",
                        "ticklen": 5,
                        "showline": true,
                        "tickfont": {
                            "color": "rgb(255, 255, 255)",
                            "family": "\"Open Sans\", verdana, arial, sans-serif",
                            "size": 12
                        },
                        "tickwidth": 1,
                        "tickangle": "auto",
                        "gridwidth": 0.1,
                        "tickcolor": "rgb(255, 255, 255)",
                        "exponentformat": "B"
                    },
                    "yaxis2": {
                        "showexponent": "none",
                        "showticklabels": true,
                        "titlefont": {
                            "color": "rgb(255, 255, 255)",
                            "family": "\"Open Sans\", verdana, arial, sans-serif",
                            "size": 18
                        },
                        "linecolor": "rgb(255, 255, 255)",
                        "mirror": "ticks",
                        "nticks": 0,
                        "rangemode": "normal",
                        "autorange": true,
                        "linewidth": 1,
                        "tickmode": "auto",
                        "title": "Current (A)",
                        "ticks": "",
                        "showgrid": true,
                        "zeroline": false,
                        "gridcolor": "rgb(217, 217, 217)",
                        "type": "linear",
                        "ticklen": 5,
                        "showline": true,
                        "tickfont": {
                            "color": "rgb(255, 255, 255)",
                            "family": "\"Open Sans\", verdana, arial, sans-serif",
                            "size": 12
                        },
                        "tickwidth": 1,
                        "tickangle": "auto",
                        "gridwidth": 0.1,
                        "tickcolor": "rgb(255, 255, 255)",
                        "exponentformat": "B",
                        "overlaying": 'y',
                        "side": 'right'
                    },
                    "paper_bgcolor": "rgb(67, 67, 67)",
                    "plot_bgcolor": "rgba(0, 0, 0, 0)",
                    "title": "Magnet",
                    "separators": ".,",
                    // "height": 300,
                    // "width": 800,
                    "titlefont": {
                        "color": "rgb(255, 255, 255)",
                        "family": "\"Open Sans\", verdana, arial, sans-serif",
                        "size": 36
                    },
                    "xaxis": {
                        "showexponent": "none",
                        "showticklabels": true,
                        // "titlefont": { "color": "rgb(255, 255, 255)", "family": "\"Open Sans\", verdana, arial, sans-serif", "size": 36 },
                        "linecolor": "rgb(255, 255, 255)",
                        "mirror": "ticks",
                        "nticks": 0,
                        "rangemode": "normal",
                        "autorange": true,
                        "linewidth": 1,
                        "tickmode": "auto",
                        // "title": "Time",
                        "ticks": "",
                        "showgrid": true,
                        "zeroline": false,
                        "gridcolor": "rgb(217, 217, 217)",
                        "type": "date",
                        "ticklen": 5,
                        "showline": true,
                        "tickfont": {
                            "color": "rgb(255, 255, 255)",
                            "family": "\"Open Sans\", verdana, arial, sans-serif",
                            "size": 12
                        },
                        "tickwidth": 1,
                        "tickangle": "auto",
                        "gridwidth": 0.1,
                        // "range": [1459859402000, 1459870802000],
                        "tickcolor": "rgb(255, 255, 255)",
                        "exponentformat": "B"
                    },
                    "hovermode": "x",
                    "font": {
                        "color": "rgb(255, 255, 255)",
                        "family": "\"Open Sans\", verdana, arial, sans-serif",
                        "size": 12
                    },
                    "legend": {
                        "font": {
                            "size": 16
                        }
                    },
                    "showlegend": false,
                    margin: {
                        t: 60,
                        autoexpand: true,
                        pad: 0,
                        l: 60,
                        r: 60,
                        b: 40
                    }
                };
            }

            this.logPlot = function(charts) {
                var plot = {
                    data: [],
                    layout: {
                        "hidesources": true,
                        "autosize": false,
                        "dragmode": "zoom",
                        "yaxis": {
                            "showexponent": "none",
                            "showticklabels": true,
                            "titlefont": {
                                "color": "rgb(255, 255, 255)",
                                "family": "\"Open Sans\", verdana, arial, sans-serif",
                                "size": 36
                            },
                            "linecolor": "rgb(255, 255, 255)",
                            "mirror": "ticks",
                            "nticks": 0,
                            "rangemode": "normal",
                            "autorange": true,
                            "linewidth": 1,
                            "tickmode": "auto",
                            // "title": "Temperature (K)",
                            "ticks": "",
                            "showgrid": true,
                            "zeroline": false,
                            "gridcolor": "rgba(217, 217, 217, 100)",
                            "type": "linear",
                            "ticklen": 5,
                            "showline": true,
                            "tickfont": {
                                "color": "rgb(255, 255, 255)",
                                "family": "-apple-system, \"Open Sans\", verdana, arial, sans-serif",
                                "size": 16
                            },
                            "tickwidth": 1,
                            "tickangle": "auto",
                            "gridwidth": 0.1,
                            // "range": [2.7809, 5.3529],
                            "tickcolor": "rgb(255, 255, 255)"
                            // "exponentformat": "B"
                        },
                        "paper_bgcolor": "rgb(67, 67, 67)",
                        "plot_bgcolor": "rgba(0, 0, 0, 0)",
                        "title": "Log",
                        "separators": ".,",
                        "height": '800',
                        "width": '1200',
                        "titlefont": {
                            "color": "rgb(255, 255, 255)",
                            "family": "-apple-system, \"Open Sans\", verdana, arial, sans-serif",
                            "size": 24
                        },
                        "xaxis": {
                            "showexponent": "none",
                            "showticklabels": true,
                            // "titlefont": { "color": "rgb(255, 255, 255)", "family": "\"Open Sans\", verdana, arial, sans-serif", "size": 36 },
                            "linecolor": "rgb(255, 255, 255)",
                            "mirror": "ticks",
                            "nticks": 0,
                            "rangemode": "normal",
                            "autorange": true,
                            "linewidth": 1,
                            "tickmode": "auto",
                            // "title": "Time",
                            "ticks": "",
                            "showgrid": true,
                            "zeroline": false,
                            "gridcolor": "rgb(217, 217, 217)",
                            "type": "date",
                            "ticklen": 5,
                            "showline": true,
                            "tickfont": {
                                "color": "rgb(255, 255, 255)",
                                "family": "\"Open Sans\", verdana, arial, sans-serif",
                                "size": 12
                            },
                            "tickwidth": 1,
                            "tickangle": "auto",
                            "gridwidth": 0.1,
                            // "range": [1459859402000, 1459870802000],
                            "tickcolor": "rgb(255, 255, 255)"
                            // "exponentformat": "B"
                        },
                        "hovermode": "x",
                        "font": {
                            "color": "rgb(255, 255, 255)",
                            "family": "-apple-system, \"Open Sans\", verdana, arial, sans-serif",
                            "size": 12
                        },
                        "legend": {
                            "font": {
                                "size": 16
                            }
                        },
                        "showlegend": true,
                        margin: {
                            // r: 60,
                            // autoexpand: true,
                            pad: 0
                            // l: 60,
                            // r: 40,
                            // b: 40
                        }
                    }
                }

                charts.forEach(function(chart, index) {
                    plot.data.push({
                        x: [],
                        y: [],
                        mode: 'lines',
                        name: chart.name
                    });
                });

                return plot
            }
        }
    ]);
