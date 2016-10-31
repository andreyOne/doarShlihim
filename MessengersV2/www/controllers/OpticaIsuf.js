scotchApp.controller('opticaIsuf', function ($scope, $routeParams,$route,mainService) {
    $("#warpPopup").hide()


    $scope.onMesiraClick = function () {
        location.href = "#/optics_mesira_hanut";
    }

    $scope.onIsufClick = function () {
        location.href = "#/optica_isuf";
    }
    $scope.onMesiraSapakClick = function () {
        location.href = "#/optics_mesira_sapak";
    }


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

    function CreateHanuiotXml() {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");

        //var RLSCODE = localStorage.getItem("RLSCODE");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
<soapenv:Header/>\
<soapenv:Body>\
<tem:'+ XMLMETHOD + '>\
<!--Optional:-->\
<tem:xml><![CDATA[\
<DATA>\
<MSG>\
<HEADER>\
<MSGVER>1</MSGVER>\
<CODE>35</CODE>\
<SENDTIME>'+ date + '</SENDTIME>\
<GPS/>\
<USRKEY>'+ USRKEY + '</USRKEY>\
<DEVKEY>9999</DEVKEY>\
<VER>4</VER>\
</HEADER>\
<DATA>\
<MOKED>'+ MOKED + '</MOKED>\
</DATA>\
</MSG>\
</DATA>]]>\
</tem:xml>\
</tem:'+ XMLMETHOD + '>\
</soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }

    function getHanuiot(xml) {
        $
        .ajax(
                      {
                          url: serverUrl,
                          dataType: "xml",
                          //dataType: 'json',
                          type: "POST",
                          async: true,
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
                              var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");
                              var children = xmlDoc.children[0].children[0].children[1].children;

                              for (var i = 0; i < children.length; i++) {
                                  var storeId = children[i].children[0].innerHTML;
                                  var storeName = children[i].children[1].innerHTML;
                                  $('.area').append($("<option></option>").attr("value", storeId).text(storeName + " , " + storeId));

                              }
                              $(".loading2").css("display", "none");
                          }
                          else {


                              navigator.notification.alert('יש תקלה בשרת');
                          }

                      }).fail(function (jqXHR, textStatus, thrownError) {
                          navigator.notification.alert('אין תקשורת, נסה שנית');
                      });
    }

    //#region On Ready Angular
    angular.element(document).ready(function () {
       MesiraMerukezetPicturesArray =[];
        disableAll();
        var hanuxML = CreateHanuiotXml();
        getHanuiot(hanuxML);
        var tt = $('#header').find('#headerText');
        tt.text('אופטיקה איסוף');
        //$("#header").load("pages/header.html", function () {
        //    var tt = $('#header').find('#headerText');
        //    tt.text('אופטיקה איסוף');
        //});
        window.addEventListener('native.keyboardshow', keyboardShowHandler);
        window.addEventListener('native.keyboardhide', keyboardHideHandler);

        //$.sidr('close');
        //$("#footer").load("pages/footer.html");
        //$("#warpPopup").hide();
        //$("warpPopup").load('deliverPopup.html');
        //$("#warpPopup").hide();

        //$('input').on('keyup', function (e) {
        //    var theEvent = e || window.event;
        //    var keyPressed = theEvent.keyCode || theEvent.which;
        //    if (keyPressed == 13) {
        //         cordova.plugins.Keyboard.close();
        //    }
        //    return true;
        //});

        $('.packageinput2').on('click', function () {
            $(this).val('');
        })

    });
    //#endregion
    function keyboardShowHandler(e) {
        $("#footer").hide();
    }
    function keyboardHideHandler(e) {
        $("#footer").show();
    }
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
        getCheckHarigim(); // need to check this function if relevant
    };

    $scope.autocomplete_options = {
        suggest: suggest_state,
        on_select: add_tag
    };

    //autocomplete end

    var misparim = [];
    function getMisparMaui() {
        misparim = mainService.manuim;
        enableAll();
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

    function playMP3() {
        var mp3URL = getMediaURL("sounds/scan.amr");
        var media = new Media(mp3URL, null, mediaError);
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
        if (validateManaualCode(barcode) && (barcode.substring(0, 2) == "51" && barcode.substring(barcode.length - 2, barcode.length) == "17")) {
            playMP3();
            $scope.$apply(function () {
                $scope.inputVal = barcode;

            });
            $('.packageinput2').val(barcode);
            $scope.onAddBarcode();
            $('.packageinput2').val(barcode);
        } else {
            barcode = '';
            navigator.notification.alert("רק פריט מסוג 51-17 ניתן לאסוף במסך זה")
            var mp3URL = getMediaURL("sounds/error.amr");
            var media = new Media(mp3URL, null, mediaError);
            media.play();
        }
        cordova.plugins.VolumeControl.setVolume(100, onVolSuccess, onVolError);
        function onVolSuccess() { }
        function onVolError() { }
    }

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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><ITEM><ITEMID></ITEMID><BC>' + barcode + '</BC><CRDT>' + date + '</CRDT><DST></DST><DELIV></DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><TYP>3</TYP><ACT>3</ACT><MEM>' + misparManui + '</MEM><DEVKEY>9999</DEVKEY><FN></FN><LN></LN><SIG></SIG><PH1></PH1><PH2></PH2><PH3></PH3><MEM></MEM><RQ></RQ><RQP>0</RQP><RQW>0</RQW><ORG>0</ORG><CRT></CRT><PLT></PLT><LNK></LNK></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
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
        currentBarcode = currentBarcode.toUpperCase();
        if (currentBarCode.substring(0, 2) == "51" && currentBarCode.substring(currentBarCode.length - 2, currentBarCode.length) == "17") {
            currentMem = $('.area').find(":selected").val();
            var memCode = currentMem;
            if (currentMem == '-1') {
                navigator.notification.alert('יש לבחור מספר חנות');
                return false;
            }

            if (currentBarCode == "" || currentBarCode == null) {
                navigator.notification.alert('לא הזנת ברקוד');
                return false;
            }
            var isOk = validateManaualCode(currentBarCode);

            if (isOk) {      
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
        else {
            navigator.notification.alert("רק פריט מסוג 51-17 ניתן לאסוף במסך זה");
        }
    };

    $scope.onEnd = function () {
        var select = $(".area").val();
        var curBar = $('.packageinput2').val();
        var curMem = $('.packageinput4').val();
        $.each($('#deleteList li'), function (index, value) {
            if ($(value).text() == curBar) { curBar = ""; };
        });
        if (select == "-1" || select==null) {
            navigator.notification.alert("לא נבחרה חנות ");
        }

        else if (curBar != "" && curBar != null) {
            navigator.notification.alert("יש ללחוץ על כפתור '+' ");
        }

        else if (index == 0 && (curBar == "" || curBar == null)) {
            navigator.notification.alert("לא נסרק או הוקלד פריט");
        }

        else {
            $route.reload();
        }

    };


});




