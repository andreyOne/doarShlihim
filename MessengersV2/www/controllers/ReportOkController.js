scotchApp.controller('reportOkController', function ($scope, $routeParams) {
    $(".miyunPopup").hide()
    console.log('reportOkController');
    var halukaCounter = 0, mesiraCounter = 0, noMesiraCounter = 0;
    var JSONreport;

    angular.element(document).ready(function () {
        $("#header").load("pages/header.html", function () {
            var tt = $('#header').find('#headerText');
            tt.text('דו"ח מאזן');
        });
        $("#footer").load("pages/footer.html");          
        $("#halukaPopup").hide();
        $("#mesiraPopup").hide();
        $("#noMesiraPopup").hide();

        //#region side menu
        $scope.$on('$routeChangeStart', function (next, current) {
            $.sidr('close');
        });
        //#endregion

        $(".mainContent").css("height", window.innerHeight - ($("#header").innerHeight() + 125));
                        
        document.getElementById('reportDate').innerHTML = displayToday();

        JSONreport = deparam($routeParams.JSONreport);

        for (var ITEM in JSONreport.DELIVERY) {
            if (JSONreport.DELIVERY.hasOwnProperty(ITEM)) {
                var deliveryArray = $.makeArray(JSONreport.DELIVERY.ITEM);
                for (var i = 0; i < deliveryArray.length; i++) {
                    if (deliveryArray[i].DELIV == 1) {
                        $("#barcdoesListMesira").append('<li>' + deliveryArray[i].BC + '</li>');
                        mesiraCounter++;
                    } else {
                        $("#barcdoesListNoMesira").append('<li>' + deliveryArray[i].BC + '</li>');
                        noMesiraCounter++;
                    }
                }
            }
        }

        for (var ITEM in JSONreport.HALUKA) {
            if (JSONreport.HALUKA.hasOwnProperty(ITEM)) {
                var halukaArray = $.makeArray(JSONreport.HALUKA.ITEM);
                for (var i = 0; i < halukaArray.length; i++) {
                    $("#barcdoesListHaluka").append('<li>' + halukaArray[i].BC + '</li>');
                    halukaCounter++;
                }
            }
        }
      
        $("#haluka").text(halukaCounter);
        $("#mesira").text(mesiraCounter);
        $("#noMesira").text(noMesiraCounter);

        //#region On open haluka popup
        $scope.showHaluka = function () {
            $("#halukaPopup").show();
        };
        //#endregion

        //#region On Close X
        $scope.hideHaluka = function () {
            $("#halukaPopup").hide();
        };
        //#endregion Close X on haluka popup

        //#region On open mesira popup
        $scope.showMesira = function () {            
            $("#mesiraPopup").show();
        };
        //#endregion

        //#region On Close X
        $scope.hideMesira = function () {
            $("#mesiraPopup").hide();
        };
        //#endregion Close X on mesira popup

        //#region On open no mesira popup
        $scope.showNoMesira = function () {
            $("#noMesiraPopup").show();
        };
        //#endregion

        //#region On Close X on no mesira popup
        $scope.hideNoMesira = function () {
            $("#noMesiraPopup").hide();
        };
        //#endregion

    });

    function displayToday() {
        var now = new Date();
        return [AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join(".");
    }

    function AddZero(num) {
        return (num >= 0 && num < 10) ? "0" + num : num + "";
    }


});

