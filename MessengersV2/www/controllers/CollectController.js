﻿scotchApp.controller('collectController', function ($scope, $routeParams) {
    $("#warpPopup").hide()
    //************************************************************ On Clicks Start ************************************************************
    $scope.scan = function () {
        scan();
    };

    $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
    });


    $scope.onCollectAll = function () {
        location.href = "#/collect_joined";
    };

    //############################################################ On Clicks Finish ############################################################

    var currentBarCode = '';


    //************************************************************ On document Ready Start ************************************************************

    angular.element(document).ready(function () {
        var tt = $('#header').find('#headerText');
        tt.text('איסוף');
        //$("#header").load("pages/header.html", function () {
        //    var tt = $('#header').find('#headerText');
        //    tt.text('איסוף');
        //});
        //$.sidr('close');
        //$("#footer").load("pages/footer.html");
        //$("#warpPopup").hide();
        //$("warpPopup").load('deliverPopup.html');
        //$.sidr('close');
        //$('input').on('keyup', function (e) {
        //    var theEvent = e || window.event;
        //    var keyPressed = theEvent.keyCode || theEvent.which;
        //    if (keyPressed == 13) {
        //         cordova.plugins.Keyboard.close();
        //    }
        //    return true;
        //});
    });


    //############################################################ On document Ready Finish ############################################################

    //************************************************************ Scan Start ************************************************************
    function scan() {
        cloudSky.zBar.scan({
            camera: "back", // defaults to "back"
            flash: "on" || "auto", // defaults to "auto". See Quirks
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
            currentBarCode = barcode;
            $scope.$apply(function () {
                $scope.inputVal = barcode;
            });
            $scope.onAddBarcode();
            $('.packageinput').val(barcode);
        } else {
            barcode = '';
            $('.packageinput').val(barcode);
            var mp3URL = getMediaURL("sounds/error.amr");
            var media = new Media(mp3URL, null, mediaError);
            media.play();
        }
        function onVolSuccess() { }
        function onVolError() { }
    }

    $('.packageinput').on('click', function () {
        $(this).val('');
    })

    function onFailure(data) {
       
    }
    //############################################################ Scan Finish ############################################################

    function CreateSaveItem4XML(barcode) {
        barcode = barcode.toUpperCase();
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        var RLSCODE = localStorage.getItem("RLSCODE");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:'+XMLMETHOD+'>\
         <!--Optional:-->\
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><ITEM><ITEMID></ITEMID><BC>' + barcode + '</BC><CRDT>' + date + '</CRDT><DST>0</DST><DELIV></DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><TYP>0</TYP><ACT>3</ACT><MEM>0</MEM><DEVKEY>9999</DEVKEY><FN>klj</FN><LN>jkl</LN><SIG></SIG><PH1></PH1><PH2></PH2><PH3></PH3><MEM></MEM><RQ></RQ><ORG></ORG><CRT></CRT><PLT></PLT></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
         </tem:'+XMLMETHOD+'>\
   </soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }

  

 
    $scope.onAddBarcode = function () {
        currentBarCode = $scope.inputVal;
        if (currentBarCode == null || currentBarCode == "") {
            navigator.notification.alert("לא נסרק / הוקלד פריט ");
            return false;
        }
        currentBarCode = currentBarCode.toUpperCase();
        var isOk = validateManaualCode(currentBarCode);
        if(isOk) {
            if (currentBarCode.substring(0, 2) == "51" && currentBarCode.substring(currentBarCode.length - 2, currentBarCode.length) == 17) {
                navigator.notification.alert('איסוף פריט מסוג 51-17 יש לבצע בתפריט איסוף מחנות בלבד');
                $scope.inputVal = "";
                return false;
            }
            else {


                var xml = CreateSaveItem4XML(currentBarCode);
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
                                  currentBarCode = '';
                                  $(".packageinput").val('');
                                  $scope.inputVal = '';
                                  navigator.notification.alert('פריט נאסף בהצלחה');
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
        
    };

});


