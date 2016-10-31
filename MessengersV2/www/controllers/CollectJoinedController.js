scotchApp.controller('collect_joinedController', function ($scope, $routeParams, mainService) {
    $("#warpPopup").hide()
    var currentBarcode = '';
    var currentMem = '';
    var index = 0;
    $scope.names = [];
    //#region On Collect Pressed
    $scope.onCollect = function () {
        window.location.href = "#/collect";
    };
    //#endregion

    $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
    });

    function disableAll() {
        $(".mainContent").children().prop('disabled', true);
        $("#footer").children().prop('disabled', true);
        $("#header").children().prop('disabled', true);
    }

    function enableAll() {
        $(".mainContent").children().prop('disabled', false);
        $("#footer").children().prop('disabled', false);
        $("#header").children().prop('disabled', false);
    }


    //#region On Ready Angular
    angular.element(document).ready(function () {
        disableAll();

        getManuim();

        var tt = $('#header').find('#headerText');
        tt.text('איסוף מרוכז');
        //$("#header").load("pages/header.html", function () {
        //    var tt = $('#header').find('#headerText');
        //    tt.text('איסוף מרוכז');
        //});
        //$.sidr('close');
        //$("#footer").load("pages/footer.html");
        //$("#warpPopup").hide();
        //$("warpPopup").load('deliverPopup.html');
        //$("#warpPopup").hide();
        //$.sidr('close');

        //$('input').on('keyup', function (e) {
        //    var theEvent = e || window.event;
        //    var keyPressed = theEvent.keyCode || theEvent.which;
        //    if (keyPressed == 13) {
        //        cordova.plugins.Keyboard.close();
        //    }
        //    return true;
        //});

    });
    //#endregion

    //#region On Close X
    $scope.onXClick = function () {
        $("#warpPopup").hide();
    };
    //#endregion


    //autocomplete start

    $scope.dirty = {};

    function suggest_state(term) {
        misparim = mainService.manuim;
        var q = term.toLowerCase().trim();
        var results = [];

        // Find first 5 states that start with `term`.
        for (var i = 0; i < misparim.length && results.length < 5; i++) {
            var state = misparim[i].MemberDesc + ',' + misparim[i].MemberNumber;
            if (state.toLowerCase().indexOf(q) > -1)
                results.push({ label: state, value: state });
        }

        return results;
    }

    function add_tag(selected) {
        MEM = selected.value.split(",")[1];
    };

    $scope.autocomplete_options = {
        suggest: suggest_state,
        on_select: add_tag
    };

    //autocomplete end

    var misparim = [];
    function getManuim() {
        misparim = mainService.manuim //JSON.parse(localStorage.getItem("Manuim"));
        //$(".loading2").css("display", "none");
        enableAll();
    }



    function CreateTablesXML() {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        var RLSCODE = localStorage.getItem("RLSCODE");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:'+ XMLMETHOD + '>\
         <!--Optional:-->\
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>3</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
</tem:'+ XMLMETHOD + '>\
   </soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }

    //#region On Scan
    $scope.scan = function () {
        scan();
    };

    function scan() {
        cloudSky.zBar.scan({
            text_instructions: "OPTIONAL Instruction Text - default = 'Please point your camera at the QR code.'", // Android only
            camera: "back", // defaults to "back"
            flash: "on" || "off" || "auto", // defaults to "auto". See Quirks
            drawSight: true || false //defaults to true, create a red sight/line in the center of the scanner view.
        }, onSuccess, onFailure);
    }

            var mp3URL = getMediaURL("sounds/scan.amr");
        var media = new Media(mp3URL, null, mediaError);

    function playMP3() {
        media.play();
    }

    function getMediaURL(s) {
        if (device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
        return s;
    }

    function mediaError(e) {
        alert('Media Error');
        alert(JSON.stringify(e));
    }


    function onSuccess(barcode) {
        

        if (validateManaualCode(barcode)) {
            playMP3();
            $scope.$apply(function () {
                $scope.inputVal = barcode;

            });
            $('.packageinput2').val(barcode);
            $scope.onAddBarcode();
            $('.packageinput2').val(barcode);
        } else {
            barcode = '';
            $('.packageinput2').val(barcode);
            var mp3URL = getMediaURL("sounds/error.amr");
            var media = new Media(mp3URL, null, mediaError);
            media.play();
        }
        function onVolSuccess() { }
        function onVolError() { }
    }


    $('.packageinput2').on('click', function () {
        $(this).val('');
    })
    function onFailure(data) {
       
    }
    //#endregion

    //#region Make Request To Server

    function containsNumber(a, obj) {
        var i = a.length;
        while (i--) {
            if (a[i].split(',')[1].trim() == obj.split(',')[1].trim()) {
                return true;
            }
        }
        return false;
    }

    function displayErrorMessage(errorMessageToDisplay) {
        navigator.notification.alert(errorMessageToDisplay);
    }

    function CreateSaveItem4XML(barcode, misparManui) {
        barcode = barcode.toUpperCase();
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        var RLSCODE = localStorage.getItem("RLSCODE");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:'+ XMLMETHOD + '>\
         <!--Optional:-->\
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><ITEM><ITEMID></ITEMID><BC>' + barcode + '</BC><CRDT>' + date + '</CRDT><DST></DST><DELIV></DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><TYP>0</TYP><ACT>3</ACT><MEM>' + misparManui + '</MEM><DEVKEY>9999</DEVKEY><FN></FN><LN></LN><SIG></SIG><PH1></PH1><PH2></PH2><PH3></PH3><MEM></MEM><RQ></RQ><RQP>0</RQP><RQW>0</RQW><ORG>0</ORG><CRT></CRT><PLT></PLT><LNK></LNK></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
         </tem:'+ XMLMETHOD + '>\
   </soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }

  

    $scope.open = function () {
        $("#warpPopup").show();
    };

    $scope.onAddBarcode = function () {
        currentBarCode = $(".packageinput2").val();
        currentBarCode = currentBarCode.toUpperCase();
        if (currentBarCode.substring(0, 2) == "51" && currentBarCode.substring(currentBarCode.length - 2, currentBarCode.length) == 17) {
            navigator.notification.alert('איסוף פריט מסוג 51-17 יש לבצע בתפריט איסוף מחנות בלבד');
            $scope.inputVal = "";
            return false;
        }
        else {
            currentMem = $(".packageinput4").val();
            var memCode = ($(".packageinput4").val().split(",")[1] || '').trim();
            if (currentMem == '') {
                navigator.notification.alert('יש לבחור מספר מנוי');
                return false;
            }
            if (!mainService.containsNumber(misparim, memCode)) {
                navigator.notification.alert('מספר מנוי לא חוקי');
                return false;
            }
            if (currentBarCode == "" || currentBarCode == null) {
                navigator.notification.alert('לא הזנת ברקוד');
                return false;
            }
            var isOk = validateManaualCode(currentBarCode);

            if (isOk) {
                if (currentBarCode.substring(0, 2) == "51" && currentBarCode.substring(currentBarCode.length - 2, currentBarCode.length) == 17) {
                    navigator.notification.alert('איסוף פריט מסוג 51-17 יש לבצע בתפריט איסוף מחנות בלבד');
                }
                else {
                    var xml = CreateSaveItem4XML(currentBarCode, memCode);
                    var x = 10;
                    $.ajax(
                          {
                              url: serverUrl,
                              dataType: "xml",
                              //dataType: 'json',
                              type: "POST",
                              async: false,
                              contentType: "text/xml;charset=utf-8",
                              headers: {
                                  "SOAPAction": SoapActionQA
                              },
                              crossDomain: true,
                              data: xml,
                              timeout: 30000 //30 seconds timeout
                          }).done(function (data) {
                              if (data != null) {
                                  var parser = new DOMParser();
                                  var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.data, "text/xml");
                                  var result = xmlDoc.firstChild.firstChild.children[1].firstChild.children[1].innerHTML;
                                  var message = xmlDoc.firstChild.firstChild.children[1].firstChild.children[2].innerHTML;
                                  if (result == "0") {
                                      index++;
                                      $("#deleteList").append('<li>' + currentBarCode + '</li>');
                                      $(".totalScanItemsIcon").text(index);
                                      $(".packageinput2").val('');
                                      currentBarCode = '';
                                  }
                                  else {
                                      navigator.notification.alert(message);
                                  }
                              }
                              else {


                                  navigator.notification.alert('יש תקלה בשרת');
                              }

                          }).fail(function (jqXHR, textStatus, thrownError) {
                              navigator.notification.alert('אין תקשורת, נסה שנית');
                          });
                }

            }
        }
    };

    $scope.onEnd = function () {
        var curBar = $('.packageinput2').val();
        var curMem = $('.packageinput4').val();
        $.each($('#deleteList li'), function (index, value) {
            if ($(value).text() == curBar) { curBar = ""; };
        });
        if ((curBar != "" && curBar != null) && (curMem != "" && curMem != null)) {
            navigator.notification.alert("יש ללחוץ על כפתור '+' ");
        }

        else if (index == 0 && (curMem == "" || curMem == null)) {
            navigator.notification.alert("לא נבחר מספר מנוי");
        }
        else if (index == 0 && (curBar == "" || curBar == null)) {
            navigator.notification.alert("לא נסרק או הוקלד פריט");
        }
        else {
            $('#deleteList').empty();
            $(".totalScanItemsIcon").text(0);
            $(".packageinput4").val("");
            $('.packageinput2').val("");
            index = 0;
        }

    };


});




