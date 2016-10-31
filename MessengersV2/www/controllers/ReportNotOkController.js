scotchApp.controller('reportNotOkController', function ($scope, $routeParams) {
$(".miyunPopup").hide()
    console.log('reportNotOkController');
    var halukaCounter = 0, mesiraCounter = 0, noMesiraCounter = 0, unBalancedCounter = 0;
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
        $("#UnBalancedPopup").hide();

        //#region side menu
        $scope.$on('$routeChangeStart', function (next, current) {
            $.sidr('close');
        });
        //#endregion

        $(".mainContent").css("height", window.innerHeight - ($("#header").innerHeight() + 125));

        document.getElementById('reportDate').innerHTML = displayToday();

        if (localStorage.getItem('deliveryCodes') === null || localStorage.getItem('deliveryCodes') == 'undefined') {
            getDeliveryCodes();                
        }
        var deliveryCodes = JSON.parse(localStorage.getItem('deliveryCodes'));
        var selectHtml = '<div class="PopFields">';
        //selectHtml += '<select class="area" id="UnbalancedSelect" name="area"><option class="areainput" value="" disabled selected>קוד מסירה</option>';
        //not disabled, in order to allow the user to un-select a specific barcode when reporting
        selectHtml += '<select class="area" name="area"><option class="areainput" value="" selected>קוד מסירה</option>';
        for (var i = 0; i < deliveryCodes.length; i++) {
            selectHtml += '<option class="areainput" value="' + deliveryCodes[i].deliveryCode + '">' + deliveryCodes[i].deliveryCode + ' ' + deliveryCodes[i].deliveryDesc.trim() + '</option>';
        }
        selectHtml += '</select></div>';

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

        for (var ITEM in JSONreport.UNBALANCED) {
            if (JSONreport.UNBALANCED.hasOwnProperty(ITEM)) {
                var unbalancedArray = $.makeArray(JSONreport.UNBALANCED.ITEM);
                for (var i = 0; i < unbalancedArray.length; i++) {
                    //$("#barcdoesListUnBalanced").append('<li id="li_' + i + '"><span id="item_' + i + '">' + unbalancedArray[i].BC + '</span><span id="selectHtml_' + i + '">' + selectHtml + '</span></li>');
                    $("#barcdoesListUnBalanced").append('<li id="li_' + i + '"><span id="item_' + i + '">' + unbalancedArray[i].BC + '</li>');
                    unBalancedCounter++;
                }
            }
        }

        $("#haluka").text(halukaCounter);
        $("#mesira").text(mesiraCounter);
        $("#noMesira").text(noMesiraCounter);
        $("#unbalanced").text(unBalancedCounter);

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

        //#region On open un balanced popup
        $scope.showUnBalanced = function () {
            $("#UnBalancedPopup").show();
        };
        //#endregion

        //#region On Close X on un balanced popup
        $scope.hideUnBalanced = function () {
            $("#UnBalancedPopup").hide();
        };
        //#endregion

        //#region On report un balanced popup
        $scope.reportUnbalanced = function () {
            //run over all the barcdoes that the user reported, and report them one by one - first msg 32, than msg 3            
            //if yes, stop reporting and display error. if not, report via message #3 and if OK remove from it the popup
            var unBalancedCounterBefore = unBalancedCounter;
            for (i = 0; i < unBalancedCounterBefore; i++) {
                var userSelect = $($('#barcdoesListUnBalanced li')[i]).find('select').val();
                if (userSelect != null && userSelect != '') {
                    //console.log("userSelect= " + userSelect);
                    var barcode = $("#item_" + $('#barcdoesListUnBalanced li')[i].getAttribute('id').split('_')[1]).text();
                    sendmessage32(barcode, userSelect, $('#barcdoesListUnBalanced li')[i].getAttribute('id').split('_')[1]);
                }
            }
            $("#UnBalancedPopup").hide();
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

    function sendmessage32(barcode, kodMesira, i) {         
        var xml = createMSG32(barcode, kodMesira);
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
                       var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");
                       var result = xmlDoc.firstChild.firstChild.children[1].firstChild.innerHTML;
                       if (result == "0") {
                           console.log("MSG 32 successfully reported");
                           sendMSG3(barcode, kodMesira, i);
                           return true; // item is not on stop
                       }
                       else {
                           var message = xmlDoc.childNodes[0].firstChild.children[1].children[1].innerHTML;
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

    function createMSG32(barcode, kodMesira) {
        var date = getCurrentDate();        
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");

        var xml =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:'+XMLMETHOD+'>\
                        <!--Optional:-->\
                            <tem:xml>\
                                <![CDATA[\
                                <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>32</CODE>\
                                <SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY/><DEVKEY/><VER>4</VER></HEADER>\
							    <DATA>\
                                    <BC>' + barcode + '</BC>\
                                    <ACT>09</ACT>\
                                    <DELIV>'+ kodMesira + '</DELIV>\
                                    <USR>' + USR + '</USR>\
                                    <MOKED>' + MOKED + '</MOKED>\
								</DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:'+XMLMETHOD+'>\
                </soapenv:Body>\
            </soapenv:Envelope>';
        return xml;
    }

    function sendMSG3(barcode, kodMesira, i) {

        var xml = createMsg3Xml(barcode, kodMesira);
        $.ajax(
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
                          crossDomain: false,
                          data: xml,
                          timeout: 30000 //30 seconds timeout
                      }).done(function (data) {
                          if (data != null) {
                              var parser = new DOMParser();
                              var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.data, "text/xml");
                              var result = xmlDoc.firstChild.firstChild.children[1].firstChild.children[1].innerHTML;
                              var message = xmlDoc.firstChild.firstChild.children[1].firstChild.children[2].innerHTML;
                              if (result == "0") {
                                  console.log('MSG 3 successfully reported');
                                  //remove the reported barcode from the barcodes list
                                  $("#li_" + i).remove();
                                  unBalancedCounter--;
                                  $("#unbalanced").text(unBalancedCounter);                                                                    
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

    function createMsg3Xml(barcode, kodMesira) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                     <soapenv:Header/>\
                        <soapenv:Body>\
                            <tem:'+ XMLMETHOD + '>\
                            <!--Optional:-->\
                                <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><ITEM><ITEMID></ITEMID><BC>' + barcode + '</BC><CRDT>' + date + '</CRDT><DST></DST><DELIV>' + kodMesira + '</DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><TYP>0</TYP><ACT>09</ACT><MEM></MEM><DEVKEY>9999</DEVKEY><FN></FN><LN></LN><SIG></SIG><PH1></PH1><PH2></PH2><PH3></PH3><MEM></MEM><RQ></RQ><RQP></RQP><RQW></RQW><ORG></ORG><CRT></CRT><PLT></PLT><LNK></LNK></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
                            </tem:'+ XMLMETHOD + '>\
                        </soapenv:Body>\
                   </soapenv:Envelope>';
        return xml;
    }
});